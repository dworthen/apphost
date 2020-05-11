declare module "apphost" {
  export interface IAppHost {
    basPath: string;
    configure: (...appExtensions: AppHostExtension[]) => Record<string, any>;
    get: <T>(key: string) => T | undefined;
    set: (key: string, obj: any) => IAppHost;
    merge: (config: Record<string, any>, key?: string) => IAppHost;
  }

  export type AppHostExtension = (AppHost: IAppHost) => IAppHost;
}
