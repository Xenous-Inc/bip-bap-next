/** @type {import("eslint").Linter.Config} */
const config = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'plugin:@next/next/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:prettier/recommended',
    ],
    rules: {
        'import/order': [
            'warn',
            {
                'groups': ['builtin', 'external', 'internal', 'parent', 'sibling'],
                'pathGroups': [
                    {
                        pattern: 'react',
                        group: 'external',
                        position: 'before',
                    },
                    {
                        pattern: '*.css',
                        group: 'index',
                        patternOptions: {
                            matchBase: true,
                        },
                        position: 'after',
                    },
                    {
                        pattern: '~/**',
                        group: 'external',
                        position: 'after',
                    },
                ],
                // "pathGroupsExcludedImportTypes": ["react"],
                'newlines-between': 'never',
                'alphabetize': {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        // local syntax principles
        'quotes': ['error', 'single'],
        'no-multi-spaces': 'error',
        'func-call-spacing': ['error', 'never'],
        'linebreak-style': ['error', 'unix'],
        'key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
        'comma-style': ['error', 'last'],
        '@typescript-eslint/array-type': [
            'error',
            {
                default: 'array-simple',
                readonly: 'array-simple',
            },
        ],
        // easy-to-read-and-refactor
        'no-else-return': ['error', { allowElseIf: false }],
        'func-names': ['error', 'never'],
        'dot-notation': 'error',
        'default-case-last': 'error',
        '@typescript-eslint/consistent-type-imports': [
            'warn',
            {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports',
            },
        ],
        // code cleanness and security
        'init-declarations': ['warn', 'always'],
        'default-param-last': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error', { hoist: 'never' }],
        'default-case': 'off',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        // hindering and useless syntax
        'no-use-before-define': 'off',
        'function-paren-newline': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksVoidReturn: { attributes: false },
            },
        ],
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-invalid-void-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
};

module.exports = config;
