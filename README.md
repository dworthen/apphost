[![TypeScript](https://img.shields.io/badge/Built%20With-TypeScript-%230074c1.svg?style=for-the-badge&logo=typescript)](http://www.typescriptlang.org/) [![NPM](https://img.shields.io/npm/v/apphost?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/apphost) [![Build Status](https://img.shields.io/github/workflow/status/dworthen/apphost/CI?style=for-the-badge&logo=github)](https://github.com/dworthen/apphost/actions?query=workflow%3ACI) [![Test Coverage](https://img.shields.io/coveralls/github/dworthen/apphost?style=for-the-badge&logo=coveralls)](https://coveralls.io/github/dworthen/apphost)

# AppHost

Simple, functional configuration manager. Load and merge config from JSON files, environment variables and cli args.

# Install

```
npm install apphost -P
```

# Usage

```JavaScript
// config/index.js
const {
  configure,
  setConfigPath,
  addFile,
  addEnv,
  addArgv
} = require("apphost");

module.exports = configure(
  // Optional. configPath defaults to CWD/config/
  setConfigPath('./config'),
  addFile("appsettings.json"),
  addFile(`appsettings.${process.env.NODE_ENV || "development"}.json`, {
    required: false,
  }),
  addEnv({
    // Optional: merge all env vars starting with prefix
    prefix: 'APP_HOST_',
    // OR explicitly map env var to config object paths
    envToConfigMapping: {
      // process.env.DB_PASSWORD will map to
      // { database: { password: '' }}
      DB_PASSWORD: 'database.password'
    }
  }),
  addArgv({
    // Optional: Specify aliases
    argvAliases: [{ argv: 'app', aliases: ['a'] }],
    // Map argv options to config object paths
    argvToConfigMapping: {
      // -a is an alias for --app.
      // Both will map to { app: { name: '' }}
      app: 'app.name'
    },
  })
);
```

**Config files**

`addFile` supports loading and merging JSON files into the config object.

**config/appsettings.json**

```JSON
{
  "app": {
    "name": "MyApp",
    "version": "1.0.0",
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

Variables that match the `prefix` option, if provided, are lowercased and then `_` are replaced with `.` in order to map to config object paths.

```
NODE_ENV=development
# Maps to database.user
APP_HOST_DATABASE_USER=admin
# Maps to database.password
DB_PASSWORD=password123
```

**CLI args**

Like environment variables, cli args map to config object in two ways. Those in the `argvToConfigMapping` are mapped according to the mapping. Alternatively, object paths can be passed directly to the script.

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
    "version": "1.0.0",
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
