module.exports = api => {
    api.cache(true);
    return {
        plugins: ['macros'],
        presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
        ],
    };
};
