import { Expression, StyleCollector } from '@trousers/utils';

const css = <Theme = {}>(
    styles: TemplateStringsArray | string[],
    ...expressions: Expression<Theme>[]
): StyleCollector<Theme> => ({
    get: () => [
        {
            styles,
            expressions,
            predicate: true,
            name: 'css__',
        },
    ],
});

export default css;
