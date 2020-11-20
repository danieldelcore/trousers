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
    const styleMap = new Map<string, number>();

    if (styleEl === null) {
        styleEl = createStyleElement(attributeId);
        targetEl.appendChild(styleEl);
    }

    const pushOrder = () =>
        styleMap.forEach((value, key, map) => map.set(key, (value += 1)));

    const popOrder = (popIndex: number) => {
        styleMap.forEach((value, key, map) => {
            const index = Array.from(map.keys()).indexOf(key);

            if (popIndex <= index) {
                map.set(key, (value -= 1));
            }
        });
    };

    const has = (id: string) => styleMap.has(id);

    const mount = (id: string, styles: string, isGlobal?: boolean) => {
        if (has(id)) return;

        try {
            const activeSheet = getSheet(styleEl!);
            // TODO: this will break because the ids change over time as new elements like globals are pushed in
            const index = isGlobal ? 0 : activeSheet.cssRules.length;
            activeSheet.insertRule(styles, index);

            if (isGlobal) pushOrder();

            styleMap.set(id, index);
        } catch (error) {
            console.warn(`Trousers - unable to insert rule: ${styles}`, error);
        }
    };

    const unmount = (id: string) => {
        if (!has(id)) return;

        const index = styleMap.get(id) as number;
        const activeSheet = getSheet(styleEl!);
        activeSheet.deleteRule(index);
        styleMap.delete(id);
        popOrder(index);
    };

    return {
        has,
        mount,
        unmount,
    };
};

export default sheet;
