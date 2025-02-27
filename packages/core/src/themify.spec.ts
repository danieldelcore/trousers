import themify from './themify';

describe('stringify', () => {
    it('converts flat theme object to string', () => {
        const result = themify({
            background: 'red',
            color: 'black',
        });

        expect(result).toEqual({
            '--background': 'red',
            '--color': 'black',
        });
    });

    it('converts nested theme object to string', () => {
        const result = themify({
            background: 'red',
            typography: {
                heading: 'violet',
                paragraph: 'black',
            },
        });

        expect(result).toEqual({
            '--background': 'red',
            '--typography-heading': 'violet',
            '--typography-paragraph': 'black',
        });
    });

    it('converts deeply nested theme object to string', () => {
        const result = themify({
            background: 'red',
            typography: {
                heading: 'violet',
                paragraph: {
                    small: 'black',
                    large: 'blue',
                },
            },
        });

        expect(result).toEqual({
            '--background': 'red',
            '--typography-heading': 'violet',
            '--typography-paragraph-large': 'blue',
            '--typography-paragraph-small': 'black',
        });
    });

    it('converts array properties', () => {
        const result = themify({
            background: 'red',
            size: [1, 2, 3, 4],
        });

        expect(result).toEqual({
            '--background': 'red',
            '--size-0': 1,
            '--size-1': 2,
            '--size-2': 3,
            '--size-3': 4,
        });
    });
});
