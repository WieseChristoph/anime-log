import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**', 'next-env.d.ts'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        plugins: {
            '@next/next': next,
        },
        rules: {
            ...next.configs.recommended.rules,
            '@typescript-eslint/consistent-type-imports': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
            ],
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { project: './tsconfig.json' },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
]);
