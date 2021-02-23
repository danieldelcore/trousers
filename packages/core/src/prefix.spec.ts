import prefix from './prefix';

describe('prefix', () => {
    it('prefixes simple css property', () => {
        const result = prefix('appearance', 'none');
        expect(result).toEqual(
            'appearance: none;-moz-appearance: none;-webkit-appearance: none;-moz-appearance: none;',
        );
    });

    it('does not prefix well supported rules', () => {
        const result = prefix('color', 'red');
        expect(result).toEqual('color: red;');
    });
});
