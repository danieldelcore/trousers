module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testRegex: '^.+\\.spec\\.(ts|tsx|js|jsx)$',
    testPathIgnorePatterns: ['/node_modules/', 'lib'],
    snapshotSerializers: ['jest-serializer-html-string'],
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
        },
    },
    moduleNameMapper: {
        '@trousers/(.*)$': '<rootDir>/packages/$1/src',
    },
};
