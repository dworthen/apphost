// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch-eslint6');

module.exports = {
  extends: ['plugin:prettier/recommended', '@rushstack/eslint-config'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};
