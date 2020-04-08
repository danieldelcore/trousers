import { generateHash } from './common';
import { Expression, StyleDefinition } from './types';

export interface SingleStyleCollector<Theme = {}> {
    get: () => StyleDefinition<Theme>;
}

function getHash(styles: TemplateStringsArray) {
    const key = styles.reduce((accum, style) => `${accum}${style}`, '');

    return generateHash(key).toString();
}

const css = <Theme = {}>(
    styles: TemplateStringsArray,
    ...expressions: Expression<Theme>[]
): SingleStyleCollector<Theme> => ({
    get: () => ({
        styles,
        expressions,
        hash: getHash(styles),
        predicate: true,
        name: 'css__',
    }),
});

export default css;
