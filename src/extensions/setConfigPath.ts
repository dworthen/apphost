import { AppHostExtension, IAppHost } from '../types.js'

export function setConfigPath(path: string): AppHostExtension {
  return (appHost: IAppHost) => {
    appHost.configPath = path
    return appHost
  }
}
