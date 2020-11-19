const createStyleElement = (attributeId: string) => {
    const element = document.createElement('style');
    element.setAttribute(attributeId, '');
    element.setAttribute('type', 'text/css');
    element.appendChild(document.createTextNode(''));
    return element;
};

const getElement = (targetEl: HTMLElement, attributeId: string) =>
    targetEl.querySelector<HTMLStyleElement>(`style[${attributeId}]`);

const getSheet = (targetEl: HTMLStyleElement) => {
    if (targetEl.sheet) return targetEl.sheet;

    for (let i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].ownerNode === targetEl) {
            return document.styleSheets[i];
        }
    }

    throw Error('Unable to get StyleSheet');
};

const sheet = (targetEl: HTMLElement, attributeId: string) => {
    let styleEl = getElement(targetEl, attributeId);
    const styleMap = new Map();

    if (styleEl === null) {
        styleEl = createStyleElement(attributeId);
        targetEl.appendChild(styleEl);
    }

    const has = (id: string) => styleMap.has(id);

    const mount = (id: string, styles: string, isGlobal?: boolean) => {
        if (has(id)) return;

        try {
            const activeSheet = getSheet(styleEl!);
            activeSheet.insertRule(
                styles,
                isGlobal ? 0 : activeSheet.cssRules.length,
            );
            styleMap.set(id, '');
        } catch (error) {
            console.warn(`Trousers - unable to insert rule: ${styles}`, error);
        }
    };

    return {
        has,
        mount,
    };
};

export default sheet;
