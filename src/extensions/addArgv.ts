/// <reference path="../global.ts" />
/* Above required for vs-code debugging with ts-node */
import minimist from 'minimist';
import type { ParsedArgs } from 'minimist';
import objectPath from 'object-path';
import { flatten } from 'flat';

export interface IAddArgvOptions {
  allow?: string[];
  alias?: Record<string, string[] | string>;
}

export function addArgv(options?: IAddArgvOptions): AppHostExtension {
  return (appHost: IAppHost) => {
    const argv: ParsedArgs = minimist(
      process.argv.slice(2),
      options?.alias ? { alias: options.alias } : undefined
    );
    appHost.set('__args', argv._);
    delete argv._;
    if (options?.allow) {
      for (const flag of options.allow) {
        const flagValue: unknown = objectPath.get(argv, flag);
        if (flagValue !== undefined) {
          appHost.set(flag, flagValue);
        }
      }
    } else {
      const flatObj: Record<string, unknown> = flatten<
        ParsedArgs,
        Record<string, unknown>
      >(argv);
      const aliasValues: string[] = Object.values(options?.alias ?? {}).reduce<
        string[]
      >((acc, cur) => {
        return acc.concat(cur);
      }, []);
      for (const [path, value] of Object.entries(flatObj)) {
        if (!aliasValues.includes(path)) {
          appHost.set(path, value);
        }
      }
    }
    return appHost;
  };
}
