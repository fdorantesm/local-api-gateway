import { Command } from 'commander';
import fs from 'fs';
import { getLogPath } from '../config';

export default function registerLogs(program: Command): void {
  program
    .command('logs <name>')
    .description('show gateway logs')
    .action((name: string) => {
      const logPath = getLogPath(name);
      if (fs.existsSync(logPath)) {
        console.log(fs.readFileSync(logPath, 'utf8'));
      } else {
        console.log('No logs found');
      }
    });
}
