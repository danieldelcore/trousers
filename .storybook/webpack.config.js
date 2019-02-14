module.exports = (baseConfig, env, config) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [{
            loader: require.resolve('awesome-typescript-loader')
        }]
    });

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
};
