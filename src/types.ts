export interface IAppHost {
  configPath: string
  config: Record<string, unknown>
  get: <T>(objectPath: string) => T | undefined
  set: <T>(objectPath: string, obj: T) => IAppHost
  merge: (config: Record<string, unknown>, key?: string) => IAppHost
}

export type AppHostExtension = (AppHost: IAppHost) => IAppHost
