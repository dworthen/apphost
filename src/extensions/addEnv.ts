import { AppHostExtension, IAppHost } from '../types.js'

export interface IAddEnvOptions {
  prefix?: string
  envToConfigMapping?: Record<string, string>
}

export function addEnv(options: IAddEnvOptions = {}): AppHostExtension {
  const { prefix, envToConfigMapping: mapping } = options

  return (appHost: IAppHost) => {
    if (mapping != null) {
      for (const [env, objPath] of Object.entries(mapping)) {
        const value = process.env[env]
        if (value != null) {
          appHost.set(objPath, parseValue(value))
        }
      }
    }

    if (prefix != null) {
      for (const [env, value] of Object.entries(process.env)) {
        if (env.startsWith(prefix)) {
          const path: string = env
            .substring(prefix.length)
            .split('_')
            .map((part, index) => {
              return index === 0
                ? part.toLocaleLowerCase()
                : part[0].toLocaleUpperCase() +
                    part.slice(1).toLocaleLowerCase()
            })
            .join('')
          appHost.set(path, parseValue(value ?? ''))
        }
      }
    }

    return appHost
  }
}

function parseValue(value: string): string | boolean | number {
  if (value.toLocaleLowerCase() === 'true') return true
  if (value.toLocaleLowerCase() === 'false') return false
  if (!isNaN(parseFloat(value))) return parseFloat(value)
  return value
}
