/// <reference path="../global.ts" />
/* Above required for vs-code debugging with ts-node */
import { resolve } from 'path';
import { existsSync } from 'fs';

export interface IAddFileOptions {
  key?: string;
  required?: boolean;
}

export function addFile(
  filename: string,
  options: IAddFileOptions = {}
): AppHostExtension {
  const { key, required = true } = options;
  return (appHost: IAppHost) => {
    const filePath: string = resolve(appHost.configPath, filename);
    if (existsSync(filePath)) {
      const config: Record<string, unknown> = require(filePath);
      appHost.merge(config, key);
    } else if (required) {
      throw new Error(`Error. Failed to load ${filePath}`);
    }
    return appHost;
  };
}
