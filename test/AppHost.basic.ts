// @ts-nocheck
import {
  configure,
  setConfigPath,
  addFile,
  addEnv,
  addArgv,
  loadEnvFile,
} from '../src/index.js'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import tap from 'tap'

const __dirname = dirname(fileURLToPath(import.meta.url))

// import dotenv from 'dotenv'

// dotenv.config({ path: resolve(__dirname, 'fixtures/.env') })

tap.test('Basic configuration', async (t) => {
  // Arrange
  const expected = {
    appName: 'MyApp',
    num: 65537,
    noFlag: false,
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
      shouldBe: {
        num: 5,
      },
    },
    some: {
      nested: {
        prop: 'Basic user:pass',
        missing: 'missing env variable: ',
      },
    },
    meta: {
      owner: 'dworthen',
    },
    env: {
      camelCase: true,
      num: 65537,
      empty: '',
    },
    __argv: {
      _: ['command'],
      corspath: 'path3',
      corsheader: 'newHeader',
      'array-arg': ['one', 'two'],
      booleanFlag: true,
      'shouldBe.num': 5,
    },
  }

  // Act
  const config = configure(
    setConfigPath(resolve(__dirname, 'fixtures/config')),
    loadEnvFile('.env'),
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
        'shouldBe.num': 'cors.shouldBe.num',
      },
    }),
  )

  // Assert
  t.deepEquals(expected, config)
})
