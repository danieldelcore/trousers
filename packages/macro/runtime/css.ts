interface Definition {
    type: 'element' | 'modifier' | 'global' | 'theme';
    id: string;
    styles: string;
}

interface CollectorReturn {
    modifier: (id: string, styles: string) => CollectorReturn;
    global: (id: string, styles: string) => CollectorReturn;
    theme: (id: string, styles: string) => CollectorReturn;
    _get: () => Definition[];
}

function css(elementId: string, elementStyles: string) {
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
