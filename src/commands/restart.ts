import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import {
  loadConfig,
  getConfigPath,
  getLogPath,
  getPidPath,
  GatewayConfig
} from '../config';

export default function registerRestart(program: Command): void {
  program
    .command('restart <name>')
    .description('restart the gateway')
    .action((name: string) => {
      const pidPath = getPidPath(name);
      if (fs.existsSync(pidPath)) {
        const pid = Number(fs.readFileSync(pidPath, 'utf8'));
        try { process.kill(pid); } catch {}
        fs.unlinkSync(pidPath);
      }
      let config: GatewayConfig;
      try {
        config = loadConfig(name);
      } catch {
        console.log('Config not found');
        return;
      }
      const configPath = getConfigPath(name);
      const logPath = getLogPath(name);
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      const serverPath = path.join(__dirname, '..', 'server.js');
      const child = spawn(process.execPath, [serverPath, '--config', configPath, '--log', logPath], { detached: true, stdio: 'ignore' });
      child.unref();
      fs.writeFileSync(pidPath, String(child.pid));
      console.log(`Gateway restarted in background (PID: ${child.pid})`);
    });
}
