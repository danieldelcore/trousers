import prefix from './prefix';

describe('prefix', () => {
    it('prefixes simple css property', () => {
        const result = prefix('appearance', 'none');
        expect(result).toEqual(
            'appearance: none;\n-moz-appearance: none;\n-webkit-appearance: none;\n-moz-appearance: none;\n',
        );
    });

    it('does not prefix well supported rules', () => {
        const result = prefix('color', 'red');
        expect(result).toEqual('color: red;\n');
    });
});
