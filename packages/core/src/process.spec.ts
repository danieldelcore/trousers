import process from './process';

describe('process', () => {
    it('stringifies basic object css', () => {
        const result = process('button', {
            backgroundColor: '#b3cde8',
            color: 'white',
        });
        expect(result).toEqual({
            button: 'background-color: #b3cde8;\ncolor: white;\n',
        });
    });

    it('stringifies basic object css', () => {
        const result = process('button', {
            backgroundColor: '#b3cde8',
            color: 'white',
        });
        expect(result).toEqual({
            button: 'background-color: #b3cde8;\ncolor: white;\n',
        });
    });

    it('stringifies nested selectors', () => {
        const result = process('.my-id', {
            backgroundColor: 'red',
            // @ts-ignore
            '& button': {
                backgroundColor: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': 'background-color: red;\n',
            '.my-id button': 'background-color: violet;\n',
        });
    });

    it('stringifies deeply nested selectors', () => {
        const result = process('.my-id', {
            backgroundColor: 'red',
            // @ts-ignore
            button: {
                backgroundColor: 'violet',
                span: {
                    backgroundColor: 'green',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': 'background-color: red;\n',
            '.my-id button': 'background-color: violet;\n',
            '.my-id button span': 'background-color: green;\n',
        });
    });

    it('stringifies deeply nested class selectors', () => {
        const result = process('.my-id', {
            backgroundColor: 'red',
            // @ts-ignore
            '#MyButton': {
                backgroundColor: 'violet',
                '.myDiv': {
                    backgroundColor: 'green',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': 'background-color: red;\n',
            '.my-id #MyButton': 'background-color: violet;\n',
            '.my-id #MyButton .myDiv': 'background-color: green;\n',
        });
    });

    it('stringifies child selectors', () => {
        const result = process('.my-id', {
            backgroundColor: 'red',
            // @ts-ignore
            '> .myButton': { backgroundColor: 'violet' },
            '& > .myButton': { color: 'violet' },
        });
        expect(result).toEqual({
            '.my-id': 'background-color: red;\n',
            '.my-id > .myButton': 'background-color: violet;\ncolor: violet;\n',
        });
    });
});
