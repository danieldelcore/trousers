import parseObject from './parse-object';

describe('parseObject', () => {
    it('correctly converts a simple style object', () => {
        const result = parseObject({
            backgroundColor: 'red',
            color: 'purple',
            borderRadius: '2px',
        });

        expect(result).toEqual(
            'background-color: red;\ncolor: purple;\nborder-radius: 2px;',
        );
    });

    it('correctly converts style object with a nested selector', () => {
        const result = parseObject({
            ':hover': {
                backgroundColor: 'blue',
                color: 'green',
            },
        });

        expect(result).toEqual(
            ':hover {\nbackground-color: blue;\ncolor: green;\n}',
        );
    });

    it('correctly converts a style object with media-query', () => {
        const result = parseObject({
            '@media (min-width: 768px)': {
                backgroundColor: '#deecff',
            },
        });

        expect(result).toEqual(
            '@media (min-width: 768px) {\nbackground-color: #deecff;\n}',
        );
    });

    it('correctly converts a style object with keyframe', () => {
        const result = parseObject({
            '@keyframes rotating': {
                //@ts-ignore
                from: {
                    transform: 'rotate(0deg)',
                },
                to: {
                    transform: 'rotate(360deg)',
                },
            },
        });

        expect(result).toEqual(
            '@keyframes rotating {\nfrom {\ntransform: rotate(0deg);\n}\nto {\ntransform: rotate(360deg);\n}\n}',
        );
    });
});
