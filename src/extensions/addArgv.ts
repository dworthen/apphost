import { IAppHost, AppHostExtension } from 'apphost';
import minimist from 'minimist';
import type { ParsedArgs } from 'minimist';
import objectPath from 'object-path';
import { flatten } from 'flat';

const argv: ParsedArgs = minimist(process.argv.slice(2));

export interface IAddArgvOptions {
  flags: string[];
}

export function addArgv(options?: IAddArgvOptions): AppHostExtension {
  return (appHost: IAppHost) => {
    appHost.set('__args', argv._);
    delete argv._;
    if (options?.flags) {
      for (const flag of options.flags) {
        const flagValue: unknown = objectPath.get(argv, flag);
        if (flagValue !== undefined) {
          appHost.set(flag, flagValue);
        }
      }
    } else {
      const flatObj: unknown = flatten(argv);
      for (const [path, value] of Object.entries(flatObj as {})) {
        appHost.set(path, value);
      }
    }
    return appHost;
  };
}
