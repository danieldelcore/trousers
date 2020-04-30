import { toHash } from '@trousers/hash';
import { Expression, StyleCollector } from '@trousers/utils';

const css = <Theme = {}>(
    styles: TemplateStringsArray | string[],
    ...expressions: Expression<Theme>[]
): StyleCollector<Theme> => ({
    get: () => [
        {
            styles,
            expressions,
            hash: toHash(styles.toString()).toString(),
            predicate: true,
            name: 'css__',
        },
    ],
});

export default css;
