import splitRules from './split-rules';

describe('splitRules', () => {
    it('groups flat styles', () => {
        const result = splitRules(`
          .foo {
            background-color: red;
            color: blue;
          }
        `);

        expect(result).toMatchSnapshot();
    });

    it('splits multiple selectors', () => {
        const result = splitRules(`
        .foo {
          background-color: red;
          color: blue;
        }

        .foo:hover {
            background-color: green;
            color: green;
          }
        `);

        expect(result).toMatchSnapshot();
    });

    it('splits media queries selectors', () => {
        const result = splitRules(`
          .foo {
            background-color: red;
            color: blue;
          }

          @media (min-width: 768px) {
            .foo { background-color: #deecff; }
          }
        `);

        expect(result).toMatchSnapshot();
    });

    it('splits keyframes', () => {
        const result = splitRules(`
          .foo {
            background-color: red;
            color: blue;
          }

          @keyframes rotating {
              from {
                  transform: rotate(0deg);
              }
              to {
                  transform: rotate(360deg);
              }
          }
        `);

        expect(result).toMatchSnapshot();
    });

    it('empty strings should return an empty array', () => {
        {
            const result = splitRules(`

        `);

            expect(result).toEqual([]);
        }
        {
            const result = splitRules(`
          \n\t
        `);

            expect(result).toEqual([]);
        }
    });
});
