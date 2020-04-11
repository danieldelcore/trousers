import stylis from 'stylis';

export interface Registry {
    register: (id: string, styles: string, isGlobal?: boolean) => void;
    has: (id: string) => boolean;
    clear: (isGlobal?: boolean) => void;
}

interface RegistryOptions {
    forceNewNode: boolean;
    appendBefore?: string;
}

const parse = (str: string) =>
    str
        .split('}')
        .filter(str => str !== '')
        .reduce<string[]>((accum, str, i) => {
            if (i > 0) {
                const prev = accum.length - 1;
                const openCount = (accum[prev].match(/{/g) || []).length;
                const closeCount = (accum[prev].match(/}/g) || []).length;

                if (openCount > closeCount) {
                    accum[prev] = accum[prev] + str + '}';
                    return accum;
                }
            }

            accum.push(str + '}');
            return accum;
        }, []);

const createStyleElement = (attributeId: string) => {
    const element = document.createElement<'style'>('style');
    element.setAttribute(attributeId, '');
    element.setAttribute('type', 'text/css');
    return element;
};

const getStyleElement = (targetElement: HTMLElement, attributeId: string) => {
    const element = targetElement.querySelector<HTMLStyleElement>(
        `style[${attributeId}]`,
    );

    return !!element ? element : createStyleElement(attributeId);
};

const registry = (
    parentElement: HTMLElement,
    attributeId: string,
    options: RegistryOptions = {
        forceNewNode: false,
        appendBefore: undefined,
    },
): Registry => {
    const styleElement = options.forceNewNode
        ? createStyleElement(attributeId)
        : getStyleElement(parentElement, attributeId);

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

    const clear = () => styleElement.remove();
    const has = (id: string): boolean =>
        styleElement.getAttribute(attributeId)!.includes(id);

    const register = (id: string, styles: string, isGlobal?: boolean) => {
        if (has(id)) return;

        const selector = !isGlobal ? id : ``;
        const processedStyles = stylis(selector, styles);

        if (process.env.NODE_ENV === 'production') {
            parse(processedStyles).forEach(styles => {
                // @ts-ignore
                styleElement.sheet.insertRule(
                    styles,
                    // @ts-ignore
                    isGlobal ? 0 : styleElement.sheet.cssRules.length,
                );
            });

            return;
        }

        const styleNode = document.createTextNode(`${processedStyles}\n`);
        const mountedStyles = styleElement.getAttribute(attributeId);

        styleElement.appendChild(styleNode);
        styleElement.setAttribute(attributeId, `${mountedStyles} ${id}`.trim());
    };

    return {
        has,
        clear,
        register,
    };
};

export default registry;
