[![npm version](https://badge.fury.io/js/apphost.svg)](https://badge.fury.io/js/apphost) ![CI](https://github.com/dworthen/apphost/workflows/CI/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/dworthen/apphost/badge.svg?branch=master)](https://coveralls.io/github/dworthen/apphost?branch=master)

# AppHost

Simple, functional configuration manager. Load and merge config from JSON files, environment variables and cli args.

# Install

```
npm install apphost -P
```

# Usage

```JavaScript
// config/index.js
import {
  AppHost,
  setConfigPath,
  addFile,
  addEnv,
  addArgv
} from "apphost";

const config = new AppHost().configure(
  // configPath defaults to CWD/config/
  setConfigPath('./config'),
  // load configuration from CWD/config/appsettings.json
  addFile("appsettings.json"),
  // Overwrite config options with env specific config
  addFile(`appsettings.${process.env.NODE_ENV || "development"}.json`, {
    required: false,
  }),
  // Load config options from process.env
  addEnv({
    // Optional: merge all env vars starting with prefix
    prefix: 'APP_HOST_',
    // OR map env var to config object paths
    envToConfigMapping: {
      // process.env.DB_PASSWORD will map to
      // { database: { password: '' }}
      DB_PASSWORD: 'database.password'
    }
  }),
  addArgv({
    // Optional: Specify aliases
    argvAliases: [{ argv: 'app', aliases: ['a'] }],
    // Map short argv options to config object paths
    argvToConfigMapping: {
      // -a is an alias for --app.
      // Both will map to { app: { name: '' }}
      app: 'app.name'
    },
  })
);

export config;
```

**config/appsettings.json**

```JSON
{
  "app": {
    "name": "MyApp",
    "version": 1.0.0,
    "description": "cool app"
  },
  "database": {
    "url": "",
    "user": "",
    "password": ""
  },
  "logging": {
    "level": "errors"
  }
}
```

**config/appsettings.development.json**

```JSON
{
  "logging": {
    "level": "debug"
  }
}
```

**Environment variables**

Enviroment variables map to the config object in two ways.

Variables specified in the `envToConfigMapping` option map as outlined in the mapping.

Variables that match the `prefix` option, if provided, are lowercased then `_` are replaced with `.` to map to config object paths.

```
NODE_ENV=development
APP_HOST_DATABASE_USER=admin
DB_PASSWORD=password123
```

**CLI args**

Like environment variables, cli args map to config object in two ways. Those in the `argvToConfigMapping` are mapped according to the mapping. Otherwise, object paths can be passed directly to the script.

**Running the application with**

```Shell
# -a is an alias for --app which maps to app.name
node app.js -a "My Awesome App" --database.url "dbUrl"
```

Results in

```JavaScript
// config
{
  "app": {
    "name": "My Awesome App",
    "version": 1.0.0,
    "description": "cool app"
  },
  "database": {
    "url": "dbUrl",
    "user": "admin",
    "password": "password123"
  },
  "logging": {
    "level": "debug"
  }
};
```
