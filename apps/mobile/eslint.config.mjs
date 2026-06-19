import base from '@pixio/eslint-config/base';

export default [
  ...base,
  {
    ignores: [
      'dist/*',
      '.expo/*',
      'node_modules/*',
      'babel.config.js',
      'metro.config.js',
      '*.config.js',
    ],
  },
];
