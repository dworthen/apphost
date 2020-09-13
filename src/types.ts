import type { Section } from 'command-line-usage';

export interface IAppHost {
  configPath: string;
  configure: (...appExtensions: AppHostExtension[]) => Record<string, unknown>;
  get: <T>(objectPath: string) => T | undefined;
  set: <T>(objectPath: string, obj: T) => IAppHost;
  merge: (config: Record<string, unknown>, key?: string) => IAppHost;
}

export type AppHostExtension = (AppHost: IAppHost) => IAppHost;
export type IAppHostCommand = (
  config: Record<string, unknown>
) => Promise<number>;

export interface IAppHostCommands {
  defaultCommand?: string;
  helpFlag?: string;
  commands: Record<
    string,
    {
      usage: Section | Section[];
      script: string | IAppHostCommand;
    }
  >;
}
