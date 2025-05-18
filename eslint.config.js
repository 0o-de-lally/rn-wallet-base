
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
// import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
      // 'import': importPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...reactPlugin.configs.recommended.globals,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-function': 'warn',

      // React specific rules
      'react/prop-types': 'off', // TypeScript takes care of this
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/display-name': 'off',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // React Native specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': ['error', { skip: ['Text.Text'] }],

      // // Import rules
      // 'import/order': [
      //   'error',
      //   {
      //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      //     'newlines-between': 'always',
      //     alphabetize: { order: 'asc', caseInsensitive: true },
      //   },
      // ],
      // 'import/no-duplicates': 'error',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // // Style rules (instead of Prettier)
      // 'semi': ['error', 'always'],
      // 'quotes': ['error', 'single', { 'avoidEscape': true }],
      // 'indent': ['error', 2, { 'SwitchCase': 1 }],
      // 'comma-dangle': ['error', 'always-multiline'],
      // 'object-curly-spacing': ['error', 'always'],
      // 'array-bracket-spacing': ['error', 'never'],
      // 'arrow-parens': ['error', 'as-needed'],
      // 'max-len': ['error', { 'code': 100 }],
    },
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '*.log', '*.config.js'],
  }
);
