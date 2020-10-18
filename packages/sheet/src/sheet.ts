const createStyleElement = (attributeId: string) => {
    const element = document.createElement('style');
    element.setAttribute(attributeId, '');
    element.setAttribute('type', 'text/css');
    element.appendChild(document.createTextNode(''));
    return element;
};

const getElement = (targetElement: HTMLElement, attributeId: string) =>
    targetElement.querySelector<HTMLStyleElement>(`style[${attributeId}]`);

const getSheet = (tag: HTMLStyleElement): CSSStyleSheet => {
    // @ts-ignore
    if (tag.sheet) return tag.sheet;

    for (let i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].ownerNode === tag) {
            // @ts-ignore
            return document.styleSheets[i];
        }
    }

    throw Error('Unable to get StyleSheet');
};

const sheet = (targetEl: HTMLElement, attributeId: string) => {
    let styleEl = getElement(targetEl, attributeId);
    const styleMap = new Map(); // TODO: this causes duplicates

    if (styleEl === null) {
        styleEl = createStyleElement(attributeId);
        targetEl.appendChild(styleEl);
    }

    const clear = () => styleEl!.remove();

    const has = (id: string) => styleMap.has(id);

    const mount = (id: string, styles: string, isGlobal?: boolean) => {
        // TODO: maybe a map isn't the best thing to use here
        styleMap.set(id, '');

        try {
            const sheet = getSheet(styleEl!);
            sheet.insertRule(styles, isGlobal ? 0 : sheet.cssRules.length);
            return;
        } catch (error) {
            console.warn(`Trousers: unable to insert rule: ${styles}`, error);
        }
    };

    return {
        has,
        clear,
        mount,
    };
};

export default sheet;
