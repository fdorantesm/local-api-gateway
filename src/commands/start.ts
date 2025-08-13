import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import {
  Route,
  GatewayConfig,
  loadConfig,
  saveConfig,
  getConfigPath,
  getLogPath,
  getPidPath,
} from '../config';
import { startServer } from '../server';

async function promptRoutes(): Promise<Route[]> {
  const routes: Route[] = [];
  let adding = true;
  while (adding) {
    const { routePath, target } = await inquirer.prompt([
      { type: 'input', name: 'routePath', message: 'Enter the path (e.g., /users):' },
      { type: 'input', name: 'target', message: 'Enter the target (e.g., http://localhost:3001):' }
    ]);
    routes.push({ path: routePath, target });
    const { again } = await inquirer.prompt([
      { type: 'confirm', name: 'again', message: 'Add another path?', default: false }
    ]);
    adding = again;
  }
  return routes;
}

export default function registerStart(program: Command): void {
  program
    .command('start [name]')
    .description('start the gateway')
    .option('-d, --detach', 'run in background')
    .action(async (name: string | undefined, options: { detach?: boolean }) => {
      let config: GatewayConfig;
      if (name) {
        config = loadConfig(name);
      } else {
        const routes = await promptRoutes();
        config = { routes };
        if (options.detach || await inquirer.prompt([{ type: 'confirm', name: 'save', message: 'Save this config?', default: true }]).then(a => a.save)) {
          const answer = await inquirer.prompt([{ type: 'input', name: 'confName', message: 'Config name:' }]);
          name = answer.confName;
          saveConfig(name!, config);
        }
      }

      if (options.detach) {
        if (!name) {
          console.error('Config name required for detach mode');
          process.exit(1);
        }
        const configPath = getConfigPath(name);
        saveConfig(name, config); // ensure saved
        const logPath = getLogPath(name);
        const pidPath = getPidPath(name);
        const serverPath = path.join(__dirname, '..', 'server.js');
        const child = spawn(process.execPath, [serverPath, '--config', configPath, '--log', logPath], { detached: true, stdio: 'ignore' });
        child.unref();
        fs.writeFileSync(pidPath, String(child.pid));
        console.log(`Gateway started in background (PID: ${child.pid})`);
      } else {
        startServer(config.routes, name ? getLogPath(name) : undefined);
      }
    });
}
