// @ts-nocheck
import { AppHost } from '../src';
import {
  setBasePath,
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
      },
    },
    meta: {
      owner: 'dworthen',
    },
    __args: ['command'],
  };

  // Act
  const config = appHost.configure(
    setBasePath(resolve(__dirname, 'fixtures/config')),
    addFile('appsettings.json'),
    addFile(`appsettings.${process.env.NODE_ENV || 'development'}.json`, {
      required: false,
    }),
    addFile('appsettings.meta.json', { key: 'meta' }),
    addFile('DOES_NOT_EXIST', { required: false }),
    addEnv(),
    addArgv(),
    addCliUsage('appusage.js')
  );

  // Assert
  t.deepEquals(config, expected);
});
