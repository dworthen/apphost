interface IAppHost {
  basPath: string;
  configure: (...appExtensions: AppHostExtension[]) => Record<string, unknown>;
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, obj: T) => IAppHost;
  registerService: <T>(name: string, service: T) => IAppHost;
  getService: <T>(name: string) => T | undefined;
  merge: (config: Record<string, unknown>, key?: string) => IAppHost;
}

type AppHostExtension = (AppHost: IAppHost) => IAppHost;
