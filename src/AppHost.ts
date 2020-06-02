/// <reference path="global.ts" />
/* Above required for vs-code debugging with ts-node */
import deepMerge from 'deepmerge';
import objectPath from 'object-path';
import { join } from 'path';

function resolve<T>(service: Function): T {
  let s: T;
  try {
    s = new (service as new () => T)();
  } catch (ex) {
    s = service() as T;
  }
  return s;
}

export class AppHost implements IAppHost {
  private _config: Record<string, unknown> = {};
  private _services: Map<string, unknown> = new Map<string, unknown>();

  public basPath: string = join(process.cwd(), 'config');

  public get<T>(key: string): T | undefined {
    const result: T = objectPath.get(this._config, key);
    return result ?? undefined;
  }

  public set<T>(key: string, obj: T): IAppHost {
    objectPath.set(this._config, key, obj);
    return this;
  }

  public registerService<T>(name: string, service: T): IAppHost {
    this._services.set(name, service);
    return this;
  }

  public getService<T>(name: string): T | undefined {
    if (this._services.has(name)) {
      const service: unknown = this._services.get(name);
      if (typeof service === 'function') {
        return resolve(service);
      }
      return service as T;
    }
    return undefined;
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
