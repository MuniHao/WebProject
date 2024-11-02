import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  {
    ignores: ['{dist,public}/**/*']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...compat.extends('@vue/eslint-config-prettier/skip-formatting'),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser
      }
    },
    files: ['**/*.{js,mjs,cjs,jsx,vue}'],
    rules: {}
  }
];
