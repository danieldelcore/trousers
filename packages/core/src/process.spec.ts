import process from './process';

describe('process', () => {
    it('stringifies basic object css', () => {
        const result = process('button', {
            backgroundColor: '#b3cde8',
            color: 'white',
        });
        expect(result).toEqual({
            button: 'background-color: #b3cde8;color: white;',
        });
    });

    it('stringifies basic object css', () => {
        const result = process('button', {
            backgroundColor: '#b3cde8',
            color: 'white',
        });
        expect(result).toEqual({
            button: 'background-color: #b3cde8;color: white;',
        });
    });

    it('stringifies nested selectors', () => {
        const result = process('.my-id', {
            backgroundColor: 'red',
            '& button': {
                backgroundColor: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': 'background-color: red;',
            '.my-id button': 'background-color: violet;',
        });
    });

    it('stringifies deeply nested selectors', () => {
        const result = process('.my-id', {
            backgroundColor: 'red',
            button: {
                backgroundColor: 'violet',
                span: {
                    backgroundColor: 'green',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': 'background-color: red;',
            '.my-id button': 'background-color: violet;',
            '.my-id button span': 'background-color: green;',
        });
    });

    it('stringifies deeply nested class selectors', () => {
        const result = process('.my-id', {
            backgroundColor: 'red',
            '#MyButton': {
                backgroundColor: 'violet',
                '.myDiv': {
                    backgroundColor: 'green',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': 'background-color: red;',
            '.my-id #MyButton': 'background-color: violet;',
            '.my-id #MyButton .myDiv': 'background-color: green;',
        });
    });

    it('stringifies child selectors', () => {
        const result = process('.my-id', {
            backgroundColor: 'red',
            '> .myButton': { backgroundColor: 'violet' },
            '& > .myButton': { color: 'violet' },
        });
        expect(result).toEqual({
            '.my-id': 'background-color: red;',
            '.my-id > .myButton': 'background-color: violet;color: violet;',
        });
    });

    it('stringifies keyframe animations', () => {
        const result = process('.my-id', {
            '@keyframes mymove': {
                from: { top: '0px' },
                to: { top: '200px' },
            },
        });
        expect(result).toEqual({
            '@keyframes mymove': 'from{top: 0px;}to{top: 200px;}',
        });
    });

    it('stringifies media queries', () => {
        const result = process('.my-id', {
            '@media screen and (max-width: 992px)': {
                '& button': {
                    background: 'violet',
                },
            },
        });
        expect(result).toEqual({
            '@media screen and (max-width: 992px)':
                '.my-id button{background: violet;}',
        });
    });

    it('stringifies top-level font-face declaration', () => {
        const result = process('', {
            '@font-face': {
                fontFamily: 'Untitled Sans',
                fontWeight: 400,
                fontDisplay: 'swap',
                src: "url(UntitledSansWeb-Regular.woff2) format('woff2')",
            },
        });
        expect(result).toEqual({
            '@font-face':
                "{font-family: Untitled Sans;font-weight: 400;font-display: swap;src: url(UntitledSansWeb-Regular.woff2) format('woff2');}",
        });
    });

    it('stringifies media queries with deeply nested selectors', () => {
        const result = process('.my-id', {
            '@media screen and (max-width: 992px)': {
                '& button': {
                    background: 'violet',
                    '& span': {
                        color: 'red',
                    },
                },
            },
        });
        expect(result).toEqual({
            '@media screen and (max-width: 992px)':
                '.my-id button{background: violet;}.my-id button span{color: red;}',
        });
    });
});
