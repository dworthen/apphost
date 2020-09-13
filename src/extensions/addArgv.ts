/// <reference path="../global.ts" />
/* Above required for vs-code debugging with ts-node */
import minimist from 'minimist';
import type { ParsedArgs } from 'minimist';
// import objectPath from 'object-path';
import { flatten } from 'flat';
import deepMerge from 'deepmerge';

export interface IAddArgvOptions {
  // include?: string[];
  argvToConfigMapping?: Record<string, string>;
}

export function addArgv(options: IAddArgvOptions = {}): AppHostExtension {
  const { argvToConfigMapping = {} } = options;
  return (appHost: IAppHost) => {
    const argv: ParsedArgs = minimist(process.argv.slice(2));

    const args: string[] = argv._;
    delete argv._;

    const flatArgs: Record<string, unknown> = flatten<
      ParsedArgs,
      Record<string, unknown>
    >(argv);

    appHost.set('__argv', deepMerge({ _: args }, flatArgs));

    for (const [arg, value] of Object.entries(flatArgs)) {
      const objPath: string = argvToConfigMapping[arg.toLowerCase()] ?? arg;
      appHost.set(objPath, value);
    }

    return appHost;
  };
}
