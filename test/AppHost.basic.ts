// @ts-nocheck
import { configure } from '../src';
import { setConfigPath, addFile, addEnv, addArgv } from '../src/extensions';
import { resolve } from 'path';
import tap from 'tap';

require('dotenv').config({ path: resolve(__dirname, 'fixtures/.env') });

tap.test('Basic configuration', async (t) => {
  // Arrange
  const expected = {
    appName: 'MyApp',
    database: {
      url: 'dev-path',
      password: 'supersecret',
      user: 'johndoe',
    },
    cors: {
      allowed: ['path1', 'path2', 'path3'],
      headers: {
        header1: 'header1',
        header2: 'newHeader',
      },
      arrayArg: ['one', 'two'],
      booleanFlag: true,
    },
    meta: {
      owner: 'dworthen',
    },
    __argv: {
      _: ['command'],
      corspath: 'path3',
      corsheader: 'newHeader',
      'array-arg': ['one', 'two'],
      booleanFlag: true,
    },
  };

  // Act
  const config = configure(
    setConfigPath(resolve(__dirname, 'fixtures/config')),
    addFile('appsettings.json'),
    addFile(`appsettings.${process.env.NODE_ENV || 'development'}.json`, {
      required: false,
    }),
    addFile('appsettings.meta.json', { key: 'meta' }),
    addFile('DOES_NOT_EXIST', { required: false }),
    addEnv({
      prefix: 'APP_HOST_',
      envToConfigMapping: {
        DB_USER: 'database.user',
      },
    }),
    addArgv({
      argvAliases: [{ argv: 'booleanFlag', aliases: ['b'] }],
      argvToConfigMapping: {
        booleanFlag: 'cors.booleanFlag',
        corspath: 'cors.allowed.2',
        corsheader: 'cors.headers.header2',
        'array-arg': 'cors.arrayArg',
      },
    })
  );

  // Assert
  t.deepEquals(expected, config);
});
