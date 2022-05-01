import { AppHost } from './AppHost.js'
import { AppHostExtension, IAppHost } from './types.js'

export function configure<
  T extends Record<string, unknown> = Record<string, unknown>,
>(...appExtensions: AppHostExtension[]): T {
  const appHost = new AppHost()
  appExtensions.reduce<IAppHost>((acc, cur) => {
    return cur(acc)
  }, appHost)
  return appHost.config as T
}
