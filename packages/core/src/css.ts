import { CSSProperties } from 'react';
import { Definition } from './types';
import hash from './hash';

function parseTheme(theme: Record<string, any>) {
    return Object.keys(theme).reduce<CSSProperties>((accum, key) => {
        // TODO: this can be nested - beware
        //@ts-ignore
        accum[`--${key}`] = theme[key];
        return accum;
    }, {});
}

function css(id: string, styles: CSSProperties) {
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
        modifier: (modifierId: string, modifierStyles: CSSProperties) => {
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
