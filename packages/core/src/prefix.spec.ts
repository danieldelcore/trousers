import prefix from './prefix';

describe('prefix', () => {
    it('prefixes simple css block', () => {
        const result = prefix(
            '.button',
            `
            display:inline-flex;
          `,
        );
        expect(result).toEqual(
            `.button{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;}`,
        );
    });

    it('does not prefix well supported rules', () => {
        const result = prefix(
            '.button',
            `
            color: red;
          `,
        );
        expect(result).toEqual(`.button{color:red;}`);
    });

    it('prefixes pseudo states', () => {
        const result = prefix(
            '.button',
            `
            background-color:red;
            &:hover {background-color:blue;}
            &:active {background-color:green;}
          `,
        );
        expect(result).toEqual(
            `.button{background-color:red;}.button:hover{background-color:blue;}.button:active{background-color:green;}`,
        );
    });

    it('prefixes nested selectors', () => {
        const result = prefix(
            '.button',
            `
            background-color:red;
            .button-text {color:blue;}
          `,
        );
        expect(result).toEqual(
            `.button{background-color:red;}.button .button-text{color:blue;}`,
        );
    });
});
