import { AppHost } from './AppHost.js'
import { AppHostExtension, IAppHost } from './types.js'

export function configure(
  ...appExtensions: AppHostExtension[]
): Record<string, unknown> {
  const appHost = new AppHost()
  appExtensions.reduce<IAppHost>((acc, cur) => {
    return cur(acc)
  }, appHost)
  return appHost.config
}
