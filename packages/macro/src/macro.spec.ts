import { transformSync } from '@babel/core';
import plugin from 'babel-plugin-macros';

const transform = (code: TemplateStringsArray) => {
    return transformSync(code[0], {
        configFile: false,
        babelrc: false,
        filename: __filename,
        presets: [['@babel/preset-react', { runtime: 'automatic' }]],
        plugins: [plugin],
    })?.code;
};

describe('macro', () => {
    describe('when parsing css collectors', () => {
        it('should process element collector', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 'blue' });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-2561700995\\": \\"color: blue;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should process element collector without an identifier', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css({ color: 'blue' });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"\\", {
                  \\".2561700995\\": \\"color: blue;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should process collector with a single modifier', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 'blue' })
                .modifier('primary', { color: 'brown' });
              const App = () => <button css={styles} $primary={true}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-2561700995\\": \\"color: blue;\\"
                }).modifier(\\"primary\\", {
                  \\".Button-2561700995--primary-2270159875\\": \\"color: brown;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  $primary: true,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should process collector with multiple modifiers', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 'blue' })
                .modifier('primary', { color: 'brown' })
                .modifier('secondary', { color: 'purple' });
              const App = ({primary, secondary}) => {
                <button css={styles} $primary={primary} $secondary={secondary}>
                  Submit
                </button>
              };
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-2561700995\\": \\"color: blue;\\"
                }).modifier(\\"primary\\", {
                  \\".Button-2561700995--primary-2270159875\\": \\"color: brown;\\"
                }).modifier(\\"secondary\\", {
                  \\".Button-2561700995--secondary-3026956261\\": \\"color: purple;\\"
                });

                const App = ({
                  primary,
                  secondary
                }) => {
                  /*#__PURE__*/
                  _jsx(TrousersNested, {
                    css: styles,
                    $primary: primary,
                    $secondary: secondary,
                    elementType: \\"button\\",
                    children: \\"Submit\\"
                  });
                };"
            `);
        });

        it('should process collector with many modifiers', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 'blue' })
                .modifier('primary', { color: 'brown' })
                .modifier('secondary', { color: 'purple' })
                .modifier('tertiary', { color: 'yellow' })
                .modifier('quaternary', { color: 'green' });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-2561700995\\": \\"color: blue;\\"
                }).modifier(\\"primary\\", {
                  \\".Button-2561700995--primary-2270159875\\": \\"color: brown;\\"
                }).modifier(\\"secondary\\", {
                  \\".Button-2561700995--secondary-3026956261\\": \\"color: purple;\\"
                }).modifier(\\"tertiary\\", {
                  \\".Button-2561700995--tertiary-41860765\\": \\"color: yellow;\\"
                }).modifier(\\"quaternary\\", {
                  \\".Button-2561700995--quaternary-2402939536\\": \\"color: green;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should process collector with a theme', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 'var(--brand-background)' })
                .theme({ brand: { background: 'green' }});
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-2140373281\\": \\"color: var(--brand-background);\\"
                }).theme(\\"\\", {
                  \\".theme-Button-2140373281-1537299292\\": \\"--brand-background: green;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should process collector with a deeply nested theme', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 'var(--brand-background)' })
                .theme({
                  neutral: '#fff',
                  brand: {
                    forground: 'yellow',
                    background: 'green',
                  },
                });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-2140373281\\": \\"color: var(--brand-background);\\"
                }).theme(\\"\\", {
                  \\".theme-Button-2140373281-3270977004\\": \\"--neutral: #fff;--brand-forground: yellow;--brand-background: green;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should process collector with a global', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', {})
                .global({
                  ':root': {
                    'backgroundColor': 'red',
                  }
                });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {}).global(\\"global-Button-3938-480010618\\", {
                  \\":root\\": \\"background-color: red;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should process collector with an aliased import name', () => {
            const result = transform`
              import { css as foo } from './macro';
              const styles = foo('Button', { color: 'blue' });

              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { foo, TrousersNested } from \\"@trousers/macro/runtime\\";
                const styles = foo(\\"Button\\", {
                  \\".Button-2561700995\\": \\"color: blue;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should do nothing in the case of an unused import', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const App = () => <button>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import React from 'react';

                const App = () => /*#__PURE__*/_jsx(\\"button\\", {
                  children: \\"Submit\\"
                });"
            `);
        });
    });

    describe('when interpolations are detected', () => {
        it('should render elements without interpolations', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 'red' });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-2313942302\\": \\"color: red;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should interpolate booleans (BooleanLiteral)', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: true });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-3336976155\\": \\"color: true;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should interpolate numbers (NumericLiteral)', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 5 });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-1906181116\\": \\"color: 5;\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should interpolate variables (Identifier)', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const foo = 'blue';
              const styles = css('Button', { color: foo });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const foo = 'blue';
                const styles = css(\\"Button\\", {
                  \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  style: {
                    \\"--interpol0\\": foo
                  },
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should interpolate functions (CallExpression)', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: foo() });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  style: {
                    \\"--interpol0\\": foo()
                  },
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should interpolate evaluations (BinaryExpression)', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const styles = css('Button', { color: 5+5 });
              const App = () => <button css={styles}>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const styles = css(\\"Button\\", {
                  \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  style: {
                    \\"--interpol0\\": 5 + 5
                  },
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should not add interpolations to jsx element if styles are not in use', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const foo = 'blue';
              const styles = css('Button', { color: foo });

              const App = () => <button>Submit</button>;
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const foo = 'blue';
                const styles = css(\\"Button\\", {
                  \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                });

                const App = () => /*#__PURE__*/_jsx(\\"button\\", {
                  children: \\"Submit\\"
                });"
            `);
        });

        it('should interpolate styles used by nested elements', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const foo = 'blue';
              const bar = 'green';
              const styles = css('Button', { color: foo });
              const innerStyles = css('ButtonInner', { color: bar });

              const App = () => (
                <button css={styles}>
                  <span css={innerStyles}>
                    Hello, World!
                  </span>
                </button>
              );
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const foo = 'blue';
                const bar = 'green';
                const styles = css(\\"Button\\", {
                  \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                });
                const innerStyles = css(\\"ButtonInner\\", {
                  \\".ButtonInner-4214944499\\": \\"color: var(--interpol1);\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  style: {
                    \\"--interpol0\\": foo
                  },
                  children: /*#__PURE__*/_jsx(TrousersNested, {
                    css: innerStyles,
                    elementType: \\"span\\",
                    style: {
                      \\"--interpol1\\": bar
                    },
                    children: \\"Hello, World!\\"
                  })
                });"
            `);
        });

        it('should interpolate styles used by sibling elements', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const foo = 'blue';
              const bar = 'green';
              const styles = css('Button', { color: foo });
              const siblingStyles = css('ButtonInner', { color: bar });

              const App = () => (
                <div>
                  <span css={siblingStyles}>
                    Hello, World!
                  </span>
                  <button css={styles}>
                    Submit
                  </button>
                </div>
              );
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { jsxs as _jsxs } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const foo = 'blue';
                const bar = 'green';
                const styles = css(\\"Button\\", {
                  \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                });
                const siblingStyles = css(\\"ButtonInner\\", {
                  \\".ButtonInner-4214944499\\": \\"color: var(--interpol1);\\"
                });

                const App = () => /*#__PURE__*/_jsxs(\\"div\\", {
                  children: [/*#__PURE__*/_jsx(TrousersNested, {
                    css: siblingStyles,
                    elementType: \\"span\\",
                    style: {
                      \\"--interpol1\\": bar
                    },
                    children: \\"Hello, World!\\"
                  }), /*#__PURE__*/_jsx(TrousersNested, {
                    css: styles,
                    elementType: \\"button\\",
                    style: {
                      \\"--interpol0\\": foo
                    },
                    children: \\"Submit\\"
                  })]
                });"
            `);
        });

        it('should interpolate reused styles', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const foo = 'blue';
              const styles = css('Button', { color: foo });

              const App = () => (
                <button css={styles}>
                  <span css={styles}>
                    Hello, World!
                  </span>
                </button>
              );
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const foo = 'blue';
                const styles = css(\\"Button\\", {
                  \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  style: {
                    \\"--interpol0\\": foo
                  },
                  children: /*#__PURE__*/_jsx(TrousersNested, {
                    css: styles,
                    elementType: \\"span\\",
                    style: {
                      \\"--interpol0\\": foo
                    },
                    children: \\"Hello, World!\\"
                  })
                });"
            `);
        });

        it('should add interpolations to an in-use style attribute', () => {
            const result = transform`
              import React from 'react';
              import { css } from './macro';
              const foo = 'blue';
              const styles = css('Button', { color: foo });

              const App = () => (
                <button css={styles} styles={{color: 'red'}}>
                    Hello, World!
                </button>
              );
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React from 'react';
                const foo = 'blue';
                const styles = css(\\"Button\\", {
                  \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                });

                const App = () => /*#__PURE__*/_jsx(TrousersNested, {
                  css: styles,
                  elementType: \\"button\\",
                  style: {
                    color: 'red',
                    \\"--interpol0\\": foo
                  },
                  children: \\"Hello, World!\\"
                });"
            `);
        });

        it('should interpolate styles passed directly into the css prop', () => {
            const result = transform`
              import React, { useState } from 'react';
              import { css } from './macro';

              const App = () => {
                const [foo, setFoo] = useState('blue');

                return (
                  <button css={css('Button', { color: foo })}>
                      Hello, World!
                  </button>
                );
              }
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React, { useState } from 'react';

                const App = () => {
                  const [foo, setFoo] = useState('blue');
                  return /*#__PURE__*/_jsx(TrousersNested, {
                    css: css(\\"Button\\", {
                      \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                    }),
                    elementType: \\"button\\",
                    style: {
                      \\"--interpol0\\": foo
                    },
                    children: \\"Hello, World!\\"
                  });
                };"
            `);
        });

        it('should interpolate styles passed directly into multiple css props', () => {
            const result = transform`
              import React, { useState } from 'react';
              import { css } from './macro';

              const App = () => {
                const [foo, setFoo] = useState('blue');
                const [bar, setBar] = useState('red');

                return (
                  <button css={css('Button', { color: foo })}>
                    <span css={css('Span', { color: bar })}>
                      Hello, World!
                    </span>
                  </button>
                );
              }
            `;

            expect(result).toMatchInlineSnapshot(`
                "import { jsx as _jsx } from \\"react/jsx-runtime\\";
                import { css, TrousersNested } from \\"@trousers/macro/runtime\\";
                import React, { useState } from 'react';

                const App = () => {
                  const [foo, setFoo] = useState('blue');
                  const [bar, setBar] = useState('red');
                  return /*#__PURE__*/_jsx(TrousersNested, {
                    css: css(\\"Button\\", {
                      \\".Button-4214914708\\": \\"color: var(--interpol0);\\"
                    }),
                    elementType: \\"button\\",
                    style: {
                      \\"--interpol0\\": foo
                    },
                    children: /*#__PURE__*/_jsx(TrousersNested, {
                      css: css(\\"Span\\", {
                        \\".Span-4214944499\\": \\"color: var(--interpol1);\\"
                      }),
                      elementType: \\"span\\",
                      style: {
                        \\"--interpol1\\": bar
                      },
                      children: \\"Hello, World!\\"
                    })
                  });
                };"
            `);
        });
    });
});
