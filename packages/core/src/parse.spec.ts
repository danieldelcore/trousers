import parse from './parse';

describe('parse', () => {
    it('converts simple style object to string', () => {
        const result = parse({
            background: 'red',
        });

        expect(result).toEqual('background:red;');
    });

    it('converts nested style object to string', () => {
        const result = parse({
            background: 'red',
            ':hover': {
                background: 'violet',
            },
        });

        expect(result).toEqual('background:red;\n:hover {background:violet;}');
    });

    it('converts deeply nested style object to string', () => {
        const result = parse({
            background: 'red',
            ':hover': {
                background: 'violet',
                '.button': {
                    background: 'green',
                },
            },
        });

        expect(result).toEqual(
            'background:red;\n:hover {background:violet;\n.button {background:green;}}',
        );
    });
});
