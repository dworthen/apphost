import deepMerge from 'deepmerge';
import objectPath from 'object-path';
import { join } from 'path';
import { IAppHost, AppHostExtension } from '.';

export class AppHost implements IAppHost {
  private _config: Record<string, unknown> = {};

  public configPath: string = join(process.cwd(), 'config');

  public get<T>(key: string): T | undefined {
    const result: T = objectPath.get(this._config, key);
    return result ?? undefined;
  }

  public set<T>(key: string, obj: T): IAppHost {
    objectPath.set(this._config, key, obj);
    return this;
  }

  public configure(
    ...appExtensions: AppHostExtension[]
  ): Record<string, unknown> {
    appExtensions.reduce<IAppHost>((acc, cur) => {
      return cur(acc);
    }, this);
    return this._config;
  }

  public merge(config: Record<string, unknown>, key?: string): IAppHost {
    const obj: unknown = key ? this.get(key) : this._config;
    const newConfig: unknown = deepMerge((obj as {}) ?? {}, config, {
      arrayMerge: (target, dest) => dest,
    });
    if (key) {
      this.set(key, newConfig);
    } else {
      this._config = newConfig as Record<string, unknown>;
    }
    return this;
  }
}
