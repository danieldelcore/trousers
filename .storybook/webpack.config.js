module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loaders: [{
            loader: require.resolve('@storybook/addon-storysource/loader'),
            options: {
                parser: 'typescript',
                prettierConfig: {
                    printWidth: 120,
                    tabWidth: 2,
                    bracketSpacing: true,
                    trailingComma: 'es5',
                    singleQuote: true,
                },
            },
        }],
        enforce: 'pre',
    });

    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [{
            loader: require.resolve('awesome-typescript-loader')
        }]
    });

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
};
