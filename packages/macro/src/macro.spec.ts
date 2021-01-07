import pluginTester from 'babel-plugin-tester';
import plugin from 'babel-plugin-macros';

pluginTester({
    plugin,
    title: '@trousers/macro',
    snapshot: true,
    babelOptions: { filename: __filename },
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
        // {
        //     title: 'correctly interpolates variables (Identifier)',
        //     code: `
        //   import { css } from './macro';
        //   const foo = 'blue';
        //   css('Button', { color: foo });
        // `,
        // },
        // {
        //     title: 'correctly interpolates functions (CallExpression)',
        //     code: `
        //   import { css } from './macro';
        //   const foo = () => 'blue';
        //   css('Button', { color: foo() });
        // `,
        // },
        // {
        //     title: 'correctly interpolates evaluations (BooleanExpression)',
        //     code: `
        //   import { css } from './macro';
        //   css('Button', { color: 5+5 });
        // `,
        // },
    ],
});
