import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { resolve } from 'path'

import { AppHostExtension, IAppHost } from '../types.js'

export function loadEnvFile(file: string): AppHostExtension {
  return (appHost: IAppHost) => {
    const env = dotenv.config({
      path: resolve(appHost.configPath, file),
    })
    dotenvExpand.expand(env)

    return appHost
  }
}
