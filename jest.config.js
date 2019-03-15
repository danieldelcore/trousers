module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testRegex: '^.+\\.spec\\.(ts|tsx|js|jsx)$',
    snapshotSerializers: [
        'jest-serializer-html-string',
    ],
};
