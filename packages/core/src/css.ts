import { CSSProperties } from 'react';
import { Definition } from './types';
import hash from './hash';

function css(id: string, styles: CSSProperties) {
    const elementId = `${id}-${hash(JSON.stringify(styles))}`;
    const styleMap: Definition[] = [
        {
            id,
            className: elementId,
            styles,
        },
    ];

    const self = {
        _get: () => styleMap,
        modifier: (modifierId: string, modifierStyles: CSSProperties) => {
            styleMap.push({
                id: modifierId,
                className: `${elementId}--${modifierId}-${hash(
                    JSON.stringify(modifierStyles),
                )}`,
                styles: modifierStyles,
            });

            return self;
        },
    };

    return self;
}

export type Collector = typeof css;

export default css;
