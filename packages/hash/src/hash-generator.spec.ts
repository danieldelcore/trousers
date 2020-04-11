import generateHash from './hash-generator';

describe('hach-generator', () => {
    it('generates a consistent hash', () => {
        const first = generateHash('Hello, world!');
        const second = generateHash('Hello, world!');

        expect(first).toEqual(second);
    });

    it('handles css', () => {
        const hash = generateHash(`
            .yomama {
                width: 99999999px;
            }
        `);

        expect(hash).toMatchSnapshot();
    });

    it('handles long css', () => {
        const hash = generateHash(`
            background-color: #b3cde8;
            border-radius: 6px;
            border: none;
            box-shadow: inset 0 -4px #9fb8d1;
            color: white;
            display: inline-block;
            cursor: pointer;
            font-family: sans-serif;
            font-weight: 500;
            letter-spacing: 1px;
            margin: 5px 10px;
            padding: 10px 20px 14px 20px;
            text-decoration: none;
            transition: background-color 300ms, color 300ms;
            outline: none;

            :hover {
                background-color: #adc6e0;
                color: rgba(255, 255, 255, 0.8);
            }

            :active {
                background-color: #9fb8d1;
            }
        `);

        expect(hash).toMatchSnapshot();
    });
});
