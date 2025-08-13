import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import chalk from 'chalk';
import fs from 'fs';
import { Command } from 'commander';
import { Route, GatewayConfig } from './config';

export function startServer(routes: Route[], logFile?: string): void {
  const app = express();
  app.use(cors());
  const format: morgan.FormatFn = (tokens, req, res) => {
    const status = tokens.status(req, res);
    const color = status && Number(status) >= 500
      ? chalk.red
      : status && Number(status) >= 400
      ? chalk.yellow
      : chalk.green;
    return [
      chalk.cyan(tokens.method(req, res)),
      tokens.url(req, res),
      color(status ?? ''),
      tokens['response-time'](req, res) + ' ms'
    ].join(' ');
  };
  app.use(morgan(format));
  if (logFile) {
    const stream = fs.createWriteStream(logFile, { flags: 'a' });
    app.use(morgan(format, { stream }));
  }
  routes.forEach(({ path, target }) => {
    app.use(path, createProxyMiddleware({ target, changeOrigin: true }));
    console.log(`Mapped ${path} -> ${target}`);
  });
  const port = 3000;
  app.listen(port, () => {
    console.log(`Gateway listening at http://localhost:${port}`);
  });
}

function runFromCli(): void {
  const program = new Command();
  program
    .requiredOption('--config <path>', 'config file')
    .option('--log <path>', 'log file')
    .action(opts => {
      const config: GatewayConfig = JSON.parse(fs.readFileSync(opts.config, 'utf8'));
      startServer(config.routes, opts.log);
    });
  program.parse(process.argv);
}

if (require.main === module) {
  runFromCli();
}
