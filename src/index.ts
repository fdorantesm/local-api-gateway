#!/usr/bin/env node
import { Command } from 'commander';
import registerStart from './commands/start';
import registerConfig from './commands/config';
import registerLogs from './commands/logs';
import registerStop from './commands/stop';
import registerStatus from './commands/status';
import registerRestart from './commands/restart';
import pkg from '../package.json';

const program = new Command();
program
  .name('gw')
  .description('Local API Gateway simulator')
  .version(pkg.version);

program
  .command('version')
  .description('show version')
  .action(() => {
    console.log(pkg.version);
  });

registerStart(program);
registerConfig(program);
registerLogs(program);
registerStop(program);
registerStatus(program);
registerRestart(program);

program.parse(process.argv);
