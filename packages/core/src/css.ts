import hash from '@trousers/hash';

import { Definition, CSSObject } from './types';
import themify from './themify';

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
                styles: themify(theme),
            });

            return self;
        },
    };

    return self;
}

export type Collector = typeof css;

export default css;
