import { Command } from 'commander';
import inquirer from 'inquirer';
import { Route, GatewayConfig, saveConfig, loadConfig, GW_DIR } from '../config';

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

export default function registerConfig(program: Command): void {
  const cmd = program.command('config').description('manage configurations');

  cmd
    .command('set <name>')
    .description('create a configuration')
    .option('-d, --dir <dir>', 'directory to save', GW_DIR)
    .action(async (name: string, options: { dir: string }) => {
      const routes = await promptRoutes();
      const config: GatewayConfig = { routes };
      saveConfig(name, config, options.dir);
      console.log(`Saved config ${name} in ${options.dir}`);
    });

  cmd
    .command('get <name>')
    .description('read a configuration')
    .option('-d, --dir <dir>', 'directory', GW_DIR)
    .action((name: string, options: { dir: string }) => {
      const config = loadConfig(name, options.dir);
      console.log(JSON.stringify(config, null, 2));
    });
}
