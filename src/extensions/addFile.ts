import { AppHostExtension, IAppHost } from "apphost";
import { resolve } from "path";
import { existsSync } from "fs";

export interface AddFileOptions {
  key?: string;
  required?: boolean;
}

export function addFile(
  filename: string,
  options?: AddFileOptions
): AppHostExtension {
  const opts = Object.assign({ required: true }, options ?? {});
  return (appHost: IAppHost) => {
    const filePath = resolve(appHost.basPath, filename);
    if (existsSync(filePath)) {
      const config = require(filePath);
      appHost.merge(config, opts.key);
    } else if (opts.required) {
      throw new Error(`Error. Failed to load ${filePath}`);
    }
    return appHost;
  };
}
