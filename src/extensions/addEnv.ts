import { AppHostExtension, IAppHost } from '../types';

export interface IAddEnvOptions {
  prefix?: string;
  envToConfigMapping?: Record<string, string>;
}

export function addEnv(options: IAddEnvOptions = {}): AppHostExtension {
  const { prefix, envToConfigMapping: mapping } = options;
  return (appHost: IAppHost) => {
    if (mapping) {
      for (const [env, objPath] of Object.entries(mapping)) {
        if (process.env[env]) {
          appHost.set(objPath, process.env[env]);
        }
      }
    }

    if (prefix) {
      for (const [env, value] of Object.entries(process.env)) {
        if (env.startsWith(prefix)) {
          const path: string = env
            .substring(prefix.length)
            .toLowerCase()
            .replace(/_/g, '.');
          appHost.set(path, value);
        }
      }
    }

    return appHost;
  };
}
