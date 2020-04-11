import { generateHash } from '@trousers/hash';
import { Expression, StyleCollector } from '@trousers/utils';

function getHash(styles: TemplateStringsArray) {
    const key = styles.reduce((accum, style) => `${accum}${style}`, '');

    return generateHash(key).toString();
}

const css = <Theme = {}>(
    styles: TemplateStringsArray,
    ...expressions: Expression<Theme>[]
): StyleCollector<Theme> => ({
    get: () => [
        {
            styles,
            expressions,
            hash: getHash(styles),
            predicate: true,
            name: 'css__',
        },
    ],
});

export default css;
