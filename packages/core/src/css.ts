import hash from '@trousers/hash';

import { Definition, CSSObject } from './types';
import { camelToKebabCase } from './util';

const parseTheme = (theme: Record<string, any>, prefix: string = '') =>
    Object.keys(theme).reduce<Record<string, any>>((accum, key) => {
        const value = theme[key];

        if (typeof value === 'object') {
            accum = {
                ...accum,
                ...parseTheme(value, prefix + camelToKebabCase(key) + '-'),
            };
        } else {
            accum[`--${prefix}${camelToKebabCase(key)}`] = value;
        }

        return accum;
    }, {});

function css(id: string, styles: CSSObject) {
    const elementId = `${id}-${hash(JSON.stringify(styles))}`;
    const styleMap: Definition[] = [
        {
            id,
            className: elementId,
            type: 'element',
            styles,
        },
    ];

    const self = {
        _get: () => styleMap,
        modifier: (modifierId: string, modifierStyles: CSSObject) => {
            styleMap.push({
                id: modifierId,
                type: 'modifier',
                className: `${elementId}--${modifierId}-${hash(
                    JSON.stringify(modifierStyles),
                )}`,
                styles: modifierStyles,
            });

            return self;
        },
        theme: (theme: Record<string, any>) => {
            styleMap.push({
                id: `theme-${id}`,
                type: 'theme',
                className: `theme-${id}`,
                styles: parseTheme(theme),
            });

            return self;
        },
    };

    return self;
}

export type Collector = typeof css;

export default css;
