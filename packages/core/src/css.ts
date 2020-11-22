import hash from '@trousers/hash';

import { Definition, CSSObject } from './types';
import themify from './themify';

export interface CollectorReturn {
    _get: () => Definition[];
    modifier: (id: string, styles: CSSObject) => CollectorReturn;
    global: (styles: CSSObject) => CollectorReturn;
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
            type: 'element',
            className: `.${elementId}`,
            styles: styleObject,
        },
    ];

    const self: CollectorReturn = {
        _get: () => styleMap,
        modifier: (modifierId, modifierStyles) => {
            styleMap.push({
                id: modifierId,
                type: 'modifier',
                className: `.${elementId}--${modifierId}-${hash(
                    JSON.stringify(modifierStyles),
                )}`,
                styles: modifierStyles,
            });

            return self;
        },
        global: globalStyles => {
            styleMap.push({
                id: `global-${id}-${hash(JSON.stringify(globalStyles))}`,
                type: 'global',
                className: '',
                styles: globalStyles,
            });

            return self;
        },
        theme: theme => {
            const themeHash = hash(JSON.stringify(theme));
            styleMap.push({
                id: `theme-${id}-${themeHash}`,
                type: 'theme',
                className: `.theme-${id}-${themeHash}`,
                styles: themify(theme),
            });

            return self;
        },
    };

    return self;
}

export type Collector = typeof css;

export default css;
