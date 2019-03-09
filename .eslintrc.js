module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
