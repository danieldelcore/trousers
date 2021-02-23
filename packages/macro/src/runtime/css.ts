interface Definition {
    type: 'element' | 'modifier' | 'global' | 'theme';
    id: string;
    styles: Record<string, string>;
}

export interface CollectorReturn {
    modifier: (
        id: Definition['id'],
        styles: Definition['styles'],
    ) => CollectorReturn;
    global: (
        id: Definition['id'],
        styles: Definition['styles'],
    ) => CollectorReturn;
    theme: (
        id: Definition['id'],
        styles: Definition['styles'],
    ) => CollectorReturn;
    _get: () => Definition[];
}

function css(elementId: Definition['id'], elementStyles: Definition['styles']) {
    const styleMap: Definition[] = [
        {
            type: 'element',
            id: elementId,
            styles: elementStyles,
        },
    ];

    const self: CollectorReturn = {
        _get: () => styleMap,
        modifier: (modifierId, modifierStyles) => {
            styleMap.push({
                type: 'modifier',
                id: modifierId,
                styles: modifierStyles,
            });

            return self;
        },
        global: (globalId, globalStyles) => {
            styleMap.push({
                type: 'global',
                id: globalId,
                styles: globalStyles,
            });

            return self;
        },
        theme: (themeId, themeStyles) => {
            styleMap.push({
                type: 'theme',
                id: themeId,
                styles: themeStyles,
            });

            return self;
        },
    };

    return self;
}

export default css;
