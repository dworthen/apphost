interface IAppHost {
  basPath: string;
  configure: (...appExtensions: AppHostExtension[]) => Record<string, unknown>;
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, obj: T) => IAppHost;
  merge: (config: Record<string, unknown>, key?: string) => IAppHost;
}

type AppHostExtension = (AppHost: IAppHost) => IAppHost;
