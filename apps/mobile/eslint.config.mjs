import base from '@pixio/eslint-config/base';

export default [
  ...base,
  {
    // require() is idiomatic for bundling static image assets in React Native.
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: [
      'dist/*',
      '.expo/*',
      'node_modules/*',
      'shims/*',
      'babel.config.js',
      'metro.config.js',
      '*.config.js',
    ],
  },
];
