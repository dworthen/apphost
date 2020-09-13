// @ts-nocheck
import { AppHost } from '../src';
import {
  setConfigPath,
  addFile,
  addEnv,
  addArgv,
  addCliUsage,
} from '../src/extensions';
import { resolve } from 'path';
import tap from 'tap';

require('dotenv').config({ path: resolve(__dirname, 'fixtures/.env') });

tap.test('Basic configuration', async (t) => {
  // Arrange
  const appHost = new AppHost();
  const expected = {
    appName: 'MyApp',
    database: {
      url: 'dev-path',
      password: 'supersecret',
    },
    cors: {
      allowed: ['path1', 'path2', 'path3'],
      headers: {
        header1: 'header1',
        header2: 'newHeader',
      },
    },
    meta: {
      owner: 'dworthen',
    },
    __args: ['command'],
  };

  // Act
  const config = appHost.configure(
    setConfigPath(resolve(__dirname, 'fixtures/config')),
    addFile('appsettings.json'),
    addFile(`appsettings.${process.env.NODE_ENV || 'development'}.json`, {
      required: false,
    }),
    addFile('appsettings.meta.json', { key: 'meta' }),
    addFile('DOES_NOT_EXIST', { required: false }),
    addEnv(),
    addArgv({
      allow: ['cors.allowed.2', 'cors.headers.header2'],
      alias: {
        'cors.allowed.2': 'corspath',
        'cors.headers.header2': 'corsheader',
      },
    }),
    addCliUsage('appusage.js')
  );

  // Assert
  t.deepEquals(expected, config);
});
