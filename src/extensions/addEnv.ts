import { AppHostExtension, IAppHost } from "apphost";

export function addEnv(prefix: string = "APP_HOST"): AppHostExtension {
  return (appHost: IAppHost) => {
    for (const [env, value] of Object.entries(process.env)) {
      if (env.startsWith(prefix)) {
        const path = env.substring(prefix.length + 1).replace(/_/g, ".");
        appHost.set(path, value);
      }
    }
    return appHost;
  };
}
