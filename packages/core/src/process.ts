import namespace from './namespace';
import hyphenate from './hyphenate';
import prefix from './prefix';
import { CSSObject } from './types';

type ProcessedRuleSet = Record<string, string>;

function stringify(styles: CSSObject): string {
    return Object.entries(styles).reduce((accum, [key, properties]) => {
        if (typeof properties === 'object') {
            return `${accum}${key}{${stringify(properties)}}`;
        }

        // @ts-ignore
        return accum + prefix(hyphenate(key), styles[key]);
    }, '');
}

function process(id: string, styles: CSSObject) {
    return Object.entries(namespace(id, styles)).reduce<ProcessedRuleSet>(
        (accum, [key, value]) => {
            accum[key] = stringify(value);
            return accum;
        },
        {},
    );
}

export default process;
