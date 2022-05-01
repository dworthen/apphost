import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { resolve } from 'path'

import { AppHostExtension, IAppHost } from '../types.js'

export interface IAddEnvOptions {
  prefix?: string
  envToConfigMapping?: Record<string, string>
  dotEnvFiles?: boolean | string | string[]
}

export function addEnv(options: IAddEnvOptions = {}): AppHostExtension {
  const { prefix, envToConfigMapping: mapping, dotEnvFiles = false } = options

  if (
    dotEnvFiles === true ||
    Array.isArray(dotEnvFiles) ||
    typeof dotEnvFiles === 'string'
  ) {
    loadDotFiles(dotEnvFiles)
  }

  return (appHost: IAppHost) => {
    if (mapping != null) {
      for (const [env, objPath] of Object.entries(mapping)) {
        if (process.env[env] != null) {
          appHost.set(objPath, process.env[env])
        }
      }
    }

    if (prefix != null) {
      for (const [env, value] of Object.entries(process.env)) {
        if (env.startsWith(prefix)) {
          const path: string = env
            .substring(prefix.length)
            .toLowerCase()
            .replace(/_/g, '.')
          appHost.set(path, value)
        }
      }
    }

    return appHost
  }
}

function loadDotFiles(dotEnvFiles: boolean | string | string[]): void {
  const filesToLoad = Array.isArray(dotEnvFiles)
    ? dotEnvFiles
    : [typeof dotEnvFiles === 'string' ? dotEnvFiles : '.env']

  filesToLoad.forEach((file) => {
    const env = dotenv.config({
      path: resolve(process.cwd(), file),
    })
    dotenvExpand.expand(env)
  })
}
