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
  options?: IAddFileOptions
): AppHostExtension {
  const opts: IAddFileOptions = Object.assign(
    { required: true },
    options ?? {}
  );
  return (appHost: IAppHost) => {
    const filePath: string = resolve(appHost.basPath, filename);
    if (existsSync(filePath)) {
      const config: Record<string, unknown> = require(filePath);
      appHost.merge(config, opts.key);
    } else if (opts.required) {
      throw new Error(`Error. Failed to load ${filePath}`);
    }
    return appHost;
  };
}
