/// <reference path="../global.ts" />
/* Above required for vs-code debugging with ts-node */

export function addEnv(prefix: string = 'APP_HOST'): AppHostExtension {
  return (appHost: IAppHost) => {
    for (const [env, value] of Object.entries(process.env)) {
      if (env.startsWith(prefix)) {
        const path: string = env
          .substring(prefix.length + 1)
          .replace(/_/g, '.');
        appHost.set(path, value);
      }
    }
    return appHost;
  };
}
