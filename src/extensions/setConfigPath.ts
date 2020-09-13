/// <reference path="../global.ts" />
/* Above required for vs-code debugging with ts-node */

export function setConfigPath(path: string): AppHostExtension {
  return (appHost: IAppHost) => {
    appHost.configPath = path;
    return appHost;
  };
}
