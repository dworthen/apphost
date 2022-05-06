import flat from 'flat'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

import { AppHostExtension, IAppHost } from '../types.js'

export interface IAddFileOptions {
  key?: string
  required?: boolean
  expandEnv?: boolean
}

export function addFile(
  filename: string,
  options: IAddFileOptions = {},
): AppHostExtension {
  const { key, required = true, expandEnv = true } = options
  return (appHost: IAppHost): IAppHost => {
    const filePath: string = resolve(appHost.configPath, filename)
    if (existsSync(filePath)) {
      const fileContents = readFileSync(filePath, 'utf-8')
      const config: Record<string, unknown> = JSON.parse(fileContents)
      appHost.merge(expandEnv ? expandVariables(config) : config, key)
    } else if (required) {
      throw new Error(`Error. Failed to load ${filePath}`)
    }
    return appHost
  }
}

function expandVariables(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const regex = /\${(?<envVar>(?:\\}|[^}])+)}/gim
  const flattenedConfig: Record<string, unknown> = flat.flatten(config)

  for (let [key, value] of Object.entries(flattenedConfig)) {
    if (typeof value === 'string') {
      const matches = []
      let match
      while ((match = regex.exec(value)) !== null) {
        matches.push(match)
      }
      for (const match of matches) {
        const envVar =
          process.env[match.groups!.envVar.replace(/\\}/, '}')] ?? ''
        value = (value as string).replace(match[0], envVar)
      }
      flattenedConfig[key] = value
    }
  }

  return flat.unflatten(flattenedConfig)
}
