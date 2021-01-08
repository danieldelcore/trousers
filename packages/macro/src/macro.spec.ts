import pluginTester from 'babel-plugin-tester';
import plugin from 'babel-plugin-macros';

pluginTester({
    plugin,
    title: '@trousers/macro',
    snapshot: true,
    babelOptions: {
        filename: __filename,
        presets: ['@babel/preset-react'],
    },
    tests: [
        {
            title: 'element',
            code: `
          import { css } from './macro';
          css('Button', { color: 'blue' });
        `,
        },
        {
            title: 'element without identifier',
            code: `
          import { css } from './macro';
          css({ color: 'blue' });
        `,
        },
        {
            title: 'modifiers',
            code: `
          import { css } from './macro';
          css('Button', { color: 'blue' })
            .modifier('primary', { color: 'brown' });
        `,
        },
        {
            title: 'multiple modifiers',
            code: `
          import { css } from './macro';
          css('Button', { color: 'blue' })
            .modifier('primary', { color: 'brown' })
            .modifier('secondary', { color: 'purple' });
        `,
        },
        {
            title: 'many modifiers',
            code: `
          import { css } from './macro';
          css('Button', { color: 'blue' })
            .modifier('primary', { color: 'brown' })
            .modifier('secondary', { color: 'purple' })
            .modifier('tertiary', { color: 'yellow' })
            .modifier('quaternary', { color: 'green' });
        `,
        },
        {
            title: 'theme',
            code: `
          import { css } from './macro';
          css('Button', { color: 'var(--brand-background)' })
            .theme({ brand: { background: 'green' }});
        `,
        },
        {
            title: 'complex theme',
            code: `
          import { css } from './macro';
          css('Button', { color: 'var(--brand-background)' })
            .theme({
              neutral: '#fff',
              brand: {
                forground: 'yellow',
                background: 'green',
              },
            });
        `,
        },
        {
            title: 'global',
            code: `
          import { css } from './macro';
          css('Button', {})
            .global({
              ':root': {
                'backgroundColor': 'red',
              }
            });
        `,
        },
        {
            title: 'different import name',
            code: `
          import { css as foo } from './macro';
          foo('Button', { color: 'blue' });
        `,
        },
        {
            title: 'unused import',
            code: `
          import { css } from './macro';
        `,
        },
        {
            title: 'correctly updates imports',
            code: `
          /** @jsx jsx */
          import { css, jsx } from './macro';
        `,
        },
        {
            title: 'correctly updates renamed imports',
            code: `
          /** @jsx bar */
          import { css as foo, jsx as bar } from './macro';
        `,
        },
        {
            title: 'correctly interpolates booleans (BooleanLiteral)',
            code: `
          import { css } from './macro';
          css('Button', { color: true });
        `,
        },
        {
            title: 'correctly interpolates booleans (NumericLiteral)',
            code: `
          import { css } from './macro';
          css('Button', { color: 5 });
        `,
        },
        {
            title: 'correctly interpolates variables (Identifier)',
            code: `
          import { css } from './macro';
          const foo = 'blue';
          const styles = css('Button', { color: foo });

          const App = () => <button css={styles} />;
        `,
        },
        {
            title: 'correctly interpolates functions (CallExpression)',
            code: `
          import { css } from './macro';

          const styles = css('Button', { color: foo() });

          const App = () => <button css={styles} />;
        `,
        },
        {
            title: 'correctly interpolates evaluations (BinaryExpression)',
            code: `
          import { css } from './macro';
          const styles = css('Button', { color: 5+5 });

          const App = () => <button css={styles} />;
        `,
        },
        {
            title: 'does not add interpolations if styles are not in use',
            code: `
          import { css } from './macro';
          const foo = 'blue';
          const styles = css('Button', { color: foo });

          const App = () => <button />;
        `,
        },
        {
            title: 'correctly interpolates styles used by nested elements',
            code: `
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
        `,
        },
        {
            title: 'correctly interpolates styles used by sibling elements',
            code: `
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
        `,
        },
        {
            title: 'correctly interpolates reused styles',
            code: `
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
        `,
        },
        {
            title:
                'interpolations are correctly added to an in-use style attribute',
            code: `
          import { css } from './macro';
          const foo = 'blue';
          const styles = css('Button', { color: foo });

          const App = () => (
            <button css={styles} styles={{color: 'red'}}>
                Hello, World!
            </button>
          );
        `,
        },
        {
            title:
                'interpolations are correctly added styles directly passed into the css',
            code: `
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
        `,
        },
    ],
});
