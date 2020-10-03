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
    if (tag.sheet) {
        // @ts-ignore
        return tag.sheet;
    }

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
    const styleMap = new Map();

    if (styleEl === null) {
        styleEl = createStyleElement(attributeId);
        targetEl.appendChild(styleEl);
    }

    const clear = () => styleEl!.remove();

    const has = (id: string) => styleMap.has(id);

    const mount = (id: string, styles: string, isGlobal?: boolean) => {
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
