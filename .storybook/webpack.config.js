module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: require.resolve('ts-loader'),
                options: {
                    transpileOnly: true,
                },
            },
        ],
    });

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
};
