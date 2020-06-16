import stylis from 'stylis';
import { splitRules } from '@trousers/parser';

export interface Registry {
    register: (id: string, styles: string, isGlobal?: boolean) => void;
    has: (id: string) => boolean;
    clear: (isGlobal?: boolean) => void;
}

interface RegistryOptions {
    forceNewNode: boolean;
    appendBefore?: string;
}

const createStyleElement = (attributeId: string) => {
    const element = document.createElement('style');
    element.setAttribute(attributeId, '');
    element.setAttribute('type', 'text/css');
    element.appendChild(document.createTextNode(''));
    return element;
};

const getStyleElement = (targetElement: HTMLElement, attributeId: string) =>
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

    throw 'Unable to get StyleSheet';
};

const registry = (
    parentElement: HTMLElement,
    attributeId: string,
    options: RegistryOptions = {
        forceNewNode: false,
        appendBefore: undefined,
    },
): Registry => {
    let styleElement = getStyleElement(parentElement, attributeId);

    if (styleElement === null || options.forceNewNode) {
        styleElement = createStyleElement(attributeId);

        if (!options.appendBefore) {
            parentElement.appendChild(styleElement);
        } else {
            parentElement.insertBefore(
                styleElement,
                parentElement.querySelector<HTMLStyleElement>(
                    `style[${options.appendBefore}]`,
                ),
            );
        }
    }

    const clear = () => styleElement!.remove();
    const has = (id: string): boolean =>
        styleElement!.getAttribute(attributeId)!.includes(id);

    const register = (id: string, styles: string, isGlobal?: boolean) => {
        if (has(id)) return;

        const selector = !isGlobal ? id : ``;
        const processedStyles = stylis(selector, styles);

        if (process.env.NODE_ENV === 'production') {
            try {
                splitRules(processedStyles).forEach(styles => {
                    const sheet = getSheet(styleElement!);
                    sheet.insertRule(
                        styles,
                        isGlobal ? 0 : sheet.cssRules.length,
                    );
                });

                return;
            } catch (error) {
                console.warn(
                    `Trousers: unable to insert rule: ${styles}`,
                    error,
                );
            }
        }

        const styleNode = document.createTextNode(`${processedStyles}\n`);
        const mountedStyles = styleElement!.getAttribute(attributeId);

        styleElement!.appendChild(styleNode);
        styleElement!.setAttribute(
            attributeId,
            `${mountedStyles} ${id}`.trim(),
        );
    };

    return {
        has,
        clear,
        register,
    };
};

export default registry;
