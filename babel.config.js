module.exports = api => {
    api.cache(true);
    return {
        presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
        ],
        overrides: [
            { test: '**/*.ts', presets: ['@babel/preset-typescript'] },
            { test: '**/*.tsx', presets: ['@babel/preset-typescript'] },
        ],
    };
};
