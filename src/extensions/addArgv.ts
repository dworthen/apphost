/// <reference path="../global.ts" />
/* Above required for vs-code debugging with ts-node */
import minimist from 'minimist';
import type { ParsedArgs } from 'minimist';
// import objectPath from 'object-path';
import { flatten } from 'flat';
import deepMerge from 'deepmerge';

export interface IArgvAlias {
  argv: string;
  aliases: string[];
}

export interface IAddArgvOptions {
  // include?: string[];
  argvAliases?: IArgvAlias[];
  argvToConfigMapping?: Record<string, string>;
}

export function addArgv(options: IAddArgvOptions = {}): AppHostExtension {
  const { argvAliases = [], argvToConfigMapping = {} } = options;
  return (appHost: IAppHost) => {
    const minimistAlias: Record<string, string[]> = argvAliases.reduce<
      Record<string, string[]>
    >((acc, cur) => {
      acc[cur.argv] = cur.aliases;
      return acc;
    }, {});

    const argv: ParsedArgs = minimist(process.argv.slice(2), {
      alias: minimistAlias,
    });
    console.log(argv);

    const args: string[] = argv._;
    delete argv._;

    for (const aliasObj of argvAliases) {
      for (const alias of aliasObj.aliases) {
        delete argv[alias];
      }
    }

    const flatArgs: Record<string, unknown> = flatten<
      ParsedArgs,
      Record<string, unknown>
    >(argv, {
      safe: true,
    });

    appHost.set('__argv', deepMerge({ _: args }, flatArgs));

    for (const [arg, value] of Object.entries(flatArgs)) {
      const objPath: string = argvToConfigMapping[arg] ?? arg;
      appHost.set(objPath, value);
    }

    return appHost;
  };
}
