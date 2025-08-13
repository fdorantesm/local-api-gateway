import { Command } from 'commander';
import fs from 'fs';
import process from 'process';
import { getPidPath } from '../config';

export default function registerStop(program: Command): void {
  program
    .command('stop <name>')
    .description('stop the gateway')
    .action((name: string) => {
      const pidPath = getPidPath(name);
      if (!fs.existsSync(pidPath)) {
        console.log('Gateway not running');
        return;
      }
      const pid = Number(fs.readFileSync(pidPath, 'utf8'));
      try {
        process.kill(pid);
        fs.unlinkSync(pidPath);
        console.log('Gateway stopped');
      } catch {
        console.log('Failed to stop gateway');
      }
    });
}
