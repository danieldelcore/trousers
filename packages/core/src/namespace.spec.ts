import namespace from './namespace';

describe('namespace', () => {
    it('namespaces properties', () => {
        const result = namespace('.my-id', {
            background: 'red',
            color: 'blue',
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
                color: 'blue',
            },
        });
    });

    it('merges duplicate & alike selectors', () => {
        const result = namespace('.my-id', {
            '& button': {
                background: 'violet',
            },
            button: {
                color: 'green',
            },
        });
        expect(result).toEqual({
            '.my-id button': {
                background: 'violet',
                color: 'green',
            },
        });
    });

    it('namespaces nested selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '& button': {
                background: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id button': {
                background: 'violet',
            },
        });
    });

    it('namespaces deeply nested selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            button: {
                background: 'violet',
                span: {
                    background: 'green',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id button': {
                background: 'violet',
            },
            '.my-id button span': {
                background: 'green',
            },
        });
    });

    it('namespaces deeply nested class selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '#MyButton': {
                background: 'violet',
                '.myDiv': {
                    background: 'green',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id #MyButton': {
                background: 'violet',
            },
            '.my-id #MyButton .myDiv': {
                background: 'green',
            },
        });
    });

    it('namespaces child selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '> .myButton': {
                background: 'violet',
            },
            '& > .myButton': {
                color: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id > .myButton': {
                background: 'violet',
                color: 'violet',
            },
        });
    });

    it('namespaces sibling selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '~ .myButton': {
                background: 'violet',
            },
            '& ~ .myButton': {
                color: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id ~ .myButton': {
                background: 'violet',
                color: 'violet',
            },
        });
    });

    it('namespaces adjacent sibling selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '+ .myButton': {
                background: 'violet',
            },
            '& + .myButton': {
                color: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id + .myButton': {
                background: 'violet',
                color: 'violet',
            },
        });
    });

    it('namespaces media queries', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '@media screen and (max-width: 992px)': {
                '& button': {
                    background: 'violet',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '@media screen and (max-width: 992px)': {
                '.my-id button': {
                    background: 'violet',
                },
            },
        });
    });

    it('namespaces media queries multiple selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '@media screen and (max-width: 992px)': {
                '& button': {
                    background: 'violet',
                },
                '& span': {
                    background: 'purple',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '@media screen and (max-width: 992px)': {
                '.my-id button': {
                    background: 'violet',
                },
                '.my-id span': {
                    background: 'purple',
                },
            },
        });
    });

    it('namespaces media queries with nested selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '@media screen and (max-width: 992px)': {
                '& button': {
                    background: 'violet',
                    '& span': {
                        background: 'green',
                    },
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '@media screen and (max-width: 992px)': {
                '.my-id button': {
                    background: 'violet',
                },
                '.my-id button span': {
                    background: 'green',
                },
            },
        });
    });

    it('namespaces keyframes', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '@keyframes mymove': {
                from: { top: '0px' },
                to: { top: '200px' },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '@keyframes mymove': {
                from: { top: '0px' },
                to: { top: '200px' },
            },
        });
    });

    it('namespaces nested selectors with & token', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '& button': {
                background: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id button': {
                background: 'violet',
            },
        });
    });

    it('namespaces deeply nested selectors with & token', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '& button': {
                background: 'violet',
                '& span': {
                    background: 'green',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id button': {
                background: 'violet',
            },
            '.my-id button span': {
                background: 'green',
            },
        });
    });

    it('namespaces nested pseudo elements', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '::before': {
                background: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id::before': {
                background: 'violet',
            },
        });
    });

    it('namespaces nested pseudo selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            ':hover': {
                background: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id:hover': {
                background: 'violet',
            },
        });
    });

    it('namespaces deeply nested pseudo selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            ':hover': {
                background: 'violet',
                button: {
                    color: 'red',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id:hover': {
                background: 'violet',
            },
            '.my-id:hover button': {
                color: 'red',
            },
        });
    });

    it('namespaces nested pseudo selectors with &', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '&:hover': {
                background: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id:hover': {
                background: 'violet',
            },
        });
    });

    it('namespaces comma separated pseudo selectors with &', () => {
        const result = namespace('.my-id', {
            background: 'red',
            '&:hover,&:active': {
                background: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id:hover,.my-id:active': {
                background: 'violet',
            },
        });
    });

    it('namespaces deeply nested pseudo selectors with &', () => {
        const result = namespace('.my-id', {
            background: 'red',
            ':hover': {
                background: 'violet',
                '& button': {
                    color: 'red',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            '.my-id:hover': {
                background: 'violet',
            },
            '.my-id:hover button': {
                color: 'red',
            },
        });
    });

    it('namespaces compound selectors', () => {
        const result = namespace('.my-id', {
            '& button, & span': {
                color: 'red',
            },
            'div, strong': {
                color: 'blue',
            },
        });
        expect(result).toEqual({
            '.my-id button, .my-id span': {
                color: 'red',
            },
            '.my-id div, .my-id strong': {
                color: 'blue',
            },
        });
    });

    it('namespaces deeply nested pseudo selectors with compound selector', () => {
        const result = namespace('.my-id', {
            '& button': {
                color: 'red',
                ':hover,:active': {
                    color: 'red',
                },
            },
        });
        expect(result).toEqual({
            '.my-id button': {
                color: 'red',
            },
            '.my-id button:hover,.my-id button:active': {
                color: 'red',
            },
        });
    });

    it('namespaces nested parent selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            'button &': {
                background: 'violet',
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            'button .my-id': {
                background: 'violet',
            },
        });
    });

    it('namespaces deeply nested parent selectors', () => {
        const result = namespace('.my-id', {
            background: 'red',
            span: {
                'button &': {
                    background: 'violet',
                },
            },
        });
        expect(result).toEqual({
            '.my-id': {
                background: 'red',
            },
            'button .my-id span': {
                background: 'violet',
            },
        });
    });
});
