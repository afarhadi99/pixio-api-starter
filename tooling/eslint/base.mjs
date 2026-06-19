import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Shared flat ESLint config for all @pixio packages.
 * Apps (web/mobile) extend this with framework-specific configs.
 */
export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**', '**/.expo/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': 'warn',
    },
  },
);
