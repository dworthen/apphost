import deepMerge from "deepmerge";
import objectPath from "object-path";
import { join } from "path";

import type { IAppHost, AppHostExtension } from "apphost";

export class AppHost implements IAppHost {
  private config: Record<string, any> = {};

  public basPath: string = join(process.cwd(), "config");

  public get = <T>(key: string) => {
    const result = objectPath.get(this.config, key);
    return (result as T) ?? undefined;
  };

  public set = (key: string, obj: any) => {
    objectPath.set(this.config, key, obj);
    return this;
  };

  public configure = (...appExtensions: AppHostExtension[]) => {
    appExtensions.reduce<IAppHost>((acc, cur) => {
      return cur(acc);
    }, this);
    return this.config;
  };

  public merge = (config: Record<string, any>, key?: string) => {
    let obj = key ? this.get<any>(key) : this.config;
    const newConfig = deepMerge(obj ?? {}, config, {
      arrayMerge: (target, dest) => dest,
    });
    if (key) {
      this.set(key, newConfig);
    } else {
      this.config = newConfig;
    }
    return this;
  };
}
