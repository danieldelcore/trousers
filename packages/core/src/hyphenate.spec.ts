import hyphenate from './hyphenate';

describe('hyphenate', () => {
    it('hyphenates simple camelCase', () => {
        expect(hyphenate('camelCase')).toEqual('camel-case');
    });

    it('hyphenates long camelCase', () => {
        expect(hyphenate('camelCaseCaseFoo')).toEqual('camel-case-case-foo');
    });

    it('does not hyphenate hyphenated string', () => {
        expect(hyphenate('snake-case')).toEqual('snake-case');
    });
});
