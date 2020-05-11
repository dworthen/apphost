import { IAppHost, AppHostExtension } from "apphost";
import minimist from "minimist";
import objectPath from "object-path";
import { flatten } from "flat";

const argv = minimist(process.argv.slice(2));

export interface AddArgvOptions {
  flags: string[];
}

export function addArgv(options?: AddArgvOptions): AppHostExtension {
  return (appHost: IAppHost) => {
    appHost.set("__args", argv._);
    delete argv._;
    if (options?.flags) {
      for (const flag of options.flags) {
        const flagValue = objectPath.get(argv, flag);
        if (flagValue !== undefined) {
          appHost.set(flag, flagValue);
        }
      }
    } else {
      const flatObj: any = flatten(argv);
      for (const [path, value] of Object.entries(flatObj)) {
        appHost.set(path, value);
      }
    }
    return appHost;
  };
}
