import { IAppHost, AppHostExtension } from "apphost";
import type { Section } from "command-line-usage";
import commandLineUsage from "command-line-usage";
import { resolve } from "path";
import { existsSync } from "fs";

export type CliUsage = CliCommands | Section | Section[] | string;

export interface CliCommands {
  commands: Record<string, Section | Section[]>;
}

export interface AddCliUsageOptions {
  help: string;
}

enum UsageType {
  String,
  Commands,
  Sections,
}

export function addCliUsage(
  usage: CliUsage,
  options?: AddCliUsageOptions
): AppHostExtension {
  const opts: AddCliUsageOptions = Object.assign(
    { help: "help" },
    options ?? {}
  );
  return (appHost: IAppHost) => {
    switch (getType(usage)) {
      case UsageType.String:
        loadFile(appHost, usage as string, opts);
        break;
      case UsageType.Commands:
        processCommand(appHost, usage as CliCommands, opts);
        break;
      case UsageType.Sections:
        printHelp(appHost, usage as Section | Section[], opts);
        break;
    }
    return appHost;
  };
}

function loadFile(
  appHost: IAppHost,
  filename: string,
  options: AddCliUsageOptions
) {
  const filePath = resolve(appHost.basPath, filename);
  if (!existsSync(filePath)) {
    throw new Error(`Error. Failed to load ${filePath}.`);
  }
  const usage = require(filePath);
  switch (getType(usage)) {
    case UsageType.Commands:
      processCommand(appHost, usage as CliCommands, options);
      break;
    case UsageType.Sections:
      printHelp(appHost, usage as Section | Section[], options);
      break;
  }
}

function printHelp(
  appHost: IAppHost,
  usage: Section | Section[],
  options: AddCliUsageOptions
) {
  if (options.help && appHost.get<boolean>(options.help)) {
    console.log(commandLineUsage(usage));
    process.exit(1);
  }
}

function processCommand(
  appHost: IAppHost,
  { commands }: CliCommands,
  options: AddCliUsageOptions
) {
  let [command = ""] = appHost.get<string[]>("__args") ?? [];
  if (command && commands[command]) {
    printHelp(appHost, commands[command], options);
  } else if (commands.main) {
    printHelp(appHost, commands.main, options);
  } else {
    const sections = Object.entries(commands).reduce<Section[]>(
      (acc, [cmd, use]) => {
        return acc.concat(use);
      },
      []
    );
    printHelp(appHost, sections, options);
  }
}

function getType(usage: CliUsage): UsageType {
  if (typeof usage === "string") {
    return UsageType.String;
  } else if ((usage as CliCommands).commands) {
    return UsageType.Commands;
  } else {
    return UsageType.Sections;
  }
}
