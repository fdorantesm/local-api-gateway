import fs from 'fs';
import os from 'os';
import path from 'path';

export interface Route {
  path: string;
  target: string;
}

export interface GatewayConfig {
  routes: Route[];
}

export const GW_DIR = path.join(os.homedir(), '.gw');

export function ensureDir(dir: string = GW_DIR): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getConfigPath(name: string, dir: string = GW_DIR): string {
  ensureDir(dir);
  return path.join(dir, `${name}.json`);
}

export function getLogPath(name: string, dir: string = GW_DIR): string {
  ensureDir(dir);
  return path.join(dir, `${name}.log`);
}

export function getPidPath(name: string, dir: string = GW_DIR): string {
  ensureDir(dir);
  return path.join(dir, `${name}.pid`);
}

export function saveConfig(name: string, config: GatewayConfig, dir: string = GW_DIR): string {
  const file = getConfigPath(name, dir);
  fs.writeFileSync(file, JSON.stringify(config, null, 2));
  return file;
}

export function loadConfig(name: string, dir: string = GW_DIR): GatewayConfig {
  const file = getConfigPath(name, dir);
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw) as GatewayConfig;
}
