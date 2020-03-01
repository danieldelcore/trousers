module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testRegex: '^.+\\.spec\\.(ts|tsx|js|jsx)$',
    testPathIgnorePatterns: ['/node_modules/', 'lib'],
    snapshotSerializers: ['jest-serializer-html-string'],
    setupFilesAfterEnv: ['@testing-library/react/cleanup-after-each'],
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
};
