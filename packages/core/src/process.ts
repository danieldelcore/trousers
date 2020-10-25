import namespace from './namespace';
import hyphenate from './hyphenate';
import prefix from './prefix';
import { CSSObject } from './types';

type RuleSet = Record<string, string>;

function process(id: string, styles: CSSObject) {
    const namespaced = namespace(id, styles);

    return Object.keys(namespaced).reduce<RuleSet>((accum, key) => {
        accum[key] = Object.keys(namespaced[key]).reduce(
            (nestedAccum, prop) =>
                nestedAccum + prefix(hyphenate(prop), namespaced[key][prop]),
            '',
        );

        return accum;
    }, {});
}

export default process;
