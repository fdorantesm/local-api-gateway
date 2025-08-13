import { Command } from 'commander';
import fs from 'fs';
import process from 'process';
import { getPidPath } from '../config';

export default function registerStatus(program: Command): void {
  program
    .command('status <name>')
    .description('show gateway status')
    .action((name: string) => {
      const pidPath = getPidPath(name);
      if (fs.existsSync(pidPath)) {
        const pid = Number(fs.readFileSync(pidPath, 'utf8'));
        try {
          process.kill(pid, 0);
          console.log(`Gateway running (PID: ${pid})`);
        } catch {
          console.log('Gateway not running');
        }
      } else {
        console.log('Gateway not running');
      }
    });
}
