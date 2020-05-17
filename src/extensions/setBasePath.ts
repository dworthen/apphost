/// <reference path="../global.ts" />
/* Above required for vs-code debugging with ts-node */

export function setBasePath(path: string): AppHostExtension {
  return (appHost: IAppHost) => {
    appHost.basPath = path;
    return appHost;
  };
}
