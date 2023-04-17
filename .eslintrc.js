module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        /**
         * Warning
         */
        // Extends
        'no-case-declarations': 'warn',
        'no-dupe-keys': 'warn',
        'no-duplicate-case': 'warn',
        'no-extra-boolean-cast': 'warn',
        'no-extra-semi': 'warn',
        'no-process-exit': 'warn',
        'no-prototype-builtins': 'warn',
        'no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
        'no-useless-escape': 'warn',
    },
}
