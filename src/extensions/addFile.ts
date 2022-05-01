import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

import { AppHostExtension, IAppHost } from '../types.js'

export interface IAddFileOptions {
  key?: string
  required?: boolean
}

export function addFile(
  filename: string,
  options: IAddFileOptions = {},
): AppHostExtension {
  const { key, required = true } = options
  return (appHost: IAppHost): IAppHost => {
    const filePath: string = resolve(appHost.configPath, filename)
    if (existsSync(filePath)) {
      const fileContents = readFileSync(filePath, 'utf-8')
      const config: Record<string, unknown> = JSON.parse(fileContents)
      appHost.merge(config, key)
    } else if (required) {
      throw new Error(`Error. Failed to load ${filePath}`)
    }
    return appHost
  }
}
