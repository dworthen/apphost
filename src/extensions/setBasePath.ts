import { IAppHost, AppHostExtension } from 'apphost';

export function setBasePath(path: string): AppHostExtension {
  return (appHost: IAppHost) => {
    appHost.basPath = path;
    return appHost;
  };
}
