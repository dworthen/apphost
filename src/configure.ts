import { IAppHost, AppHostExtension } from './types';
import { AppHost } from './AppHost';

export function configure(
  ...appExtensions: AppHostExtension[]
): Record<string, unknown> {
  const appHost = new AppHost();
  appExtensions.reduce<IAppHost>((acc, cur) => {
    return cur(acc);
  }, appHost);
  return appHost.config;
}
