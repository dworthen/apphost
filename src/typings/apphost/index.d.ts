declare module 'apphost' {
  export interface IAppHost {
    basPath: string;
    configure: (
      ...appExtensions: AppHostExtension[]
    ) => Record<string, unknown>;
    get: <T>(key: string) => T | undefined;
    set: (key: string, obj: unknown) => IAppHost;
    merge: (config: Record<string, unknown>, key?: string) => IAppHost;
  }

  export type AppHostExtension = (AppHost: IAppHost) => IAppHost;
}
