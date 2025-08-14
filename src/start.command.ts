import { Command, CommandRunner, Option } from 'nest-commander';
import { loadConfig } from './config';
import { startServer } from './server';

interface StartOptions {
  config?: string;
  log?: string;
}

@Command({
  name: 'start',
  description: 'Start the gateway server',
})
export class StartCommand extends CommandRunner {
  async run(inputs: string[], options?: StartOptions): Promise<void> {
    const name = options?.config;
    if (!name) {
      throw new Error('Missing required option --config');
    }
    const cfg = loadConfig(name);
    startServer(cfg.routes, options?.log);
  }

  @Option({
    flags: '--config <name>',
    description: 'Configuration name',
  })
  parseConfig(val: string): string {
    return val;
  }

  @Option({
    flags: '--log <path>',
    description: 'Log file path',
  })
  parseLog(val: string): string {
    return val;
  }
}
