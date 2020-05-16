import { IAppHost, AppHostExtension } from 'apphost';
import type { Section } from 'command-line-usage';
import commandLineUsage from 'command-line-usage';
import { resolve } from 'path';
import { existsSync } from 'fs';

export type CliUsage = ICliCommands | Section | Section[] | string;

export interface ICliCommands {
  commands: Record<string, Section | Section[]>;
}

export interface IAddCliUsageOptions {
  help: string;
}

enum UsageType {
  String,
  Commands,
  Sections,
}

function getType(usage: CliUsage): UsageType {
  if (typeof usage === 'string') {
    return UsageType.String;
  } else if ((usage as ICliCommands).commands) {
    return UsageType.Commands;
  } else {
    return UsageType.Sections;
  }
}

function printHelp(
  appHost: IAppHost,
  usage: Section | Section[],
  options: IAddCliUsageOptions
): void {
  if (options.help && appHost.get<boolean>(options.help)) {
    console.log(commandLineUsage(usage));
    process.exit(1);
  }
}

function processCommand(
  appHost: IAppHost,
  { commands }: ICliCommands,
  options: IAddCliUsageOptions
): void {
  const [command = ''] = appHost.get<string[]>('__args') ?? [];
  if (command && commands[command]) {
    printHelp(appHost, commands[command], options);
  } else if (commands.main) {
    printHelp(appHost, commands.main, options);
  } else {
    const sections: Section[] = Object.entries(commands).reduce<Section[]>(
      (acc, [cmd, use]) => {
        return acc.concat(use);
      },
      []
    );
    printHelp(appHost, sections, options);
  }
}

function loadFile(
  appHost: IAppHost,
  filename: string,
  options: IAddCliUsageOptions
): void {
  const filePath: string = resolve(appHost.basPath, filename);
  if (!existsSync(filePath)) {
    throw new Error(`Error. Failed to load ${filePath}.`);
  }
  const usage: CliUsage = require(filePath);
  switch (getType(usage)) {
    case UsageType.Commands:
      processCommand(appHost, usage as ICliCommands, options);
      break;
    case UsageType.Sections:
      printHelp(appHost, usage as Section | Section[], options);
      break;
  }
}

export function addCliUsage(
  usage: CliUsage,
  options?: IAddCliUsageOptions
): AppHostExtension {
  const opts: IAddCliUsageOptions = Object.assign(
    { help: 'help' },
    options ?? {}
  );
  return (appHost: IAppHost) => {
    switch (getType(usage)) {
      case UsageType.String:
        loadFile(appHost, usage as string, opts);
        break;
      case UsageType.Commands:
        processCommand(appHost, usage as ICliCommands, opts);
        break;
      case UsageType.Sections:
        printHelp(appHost, usage as Section | Section[], opts);
        break;
    }
    return appHost;
  };
}
