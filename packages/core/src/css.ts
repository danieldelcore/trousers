import hash from '@trousers/hash';

import { Definition, CSSObject } from './types';
import themify from './themify';

export interface CollectorReturn {
    _get: () => Definition[];
    modifier: (
        modifierId: string,
        modifierStyles: CSSObject,
    ) => CollectorReturn;
    theme: (theme: Record<string, any>) => CollectorReturn;
}

function css(styles: CSSObject): CollectorReturn;
function css(
    idOrStyle: string | CSSObject,
    styles?: CSSObject,
): CollectorReturn;
function css(
    idOrStyle: string | CSSObject,
    styles?: CSSObject,
): CollectorReturn {
    let id = typeof idOrStyle === 'string' ? idOrStyle : '';
    let styleObject = (typeof idOrStyle === 'string'
        ? styles
        : idOrStyle) as CSSObject;

    const elementId = `${id}-${hash(JSON.stringify(styleObject))}`;
    const styleMap: Definition[] = [
        {
            id,
            className: elementId,
            type: 'element',
            styles: styleObject,
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
