import stylis from 'stylis';

import RegistryInterface from './registry-interface';

interface RegistryOptions {
    forceNewNode: boolean;
    appendBefore?: string;
}

const parse = (str: string) =>
    str
        .split('}')
        .filter(str => str !== '')
        .reduce((accum: string[], str, i) => {
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

class Registry implements RegistryInterface {
    private styleElement!: HTMLStyleElement;
    private stylis: ReturnType<typeof stylis>;

    constructor(
        private parentElement: HTMLElement,
        private attributeId: string,
        private options: RegistryOptions = {
            forceNewNode: false,
            appendBefore: undefined,
        },
    ) {
        this.attributeId = attributeId;
        this.parentElement = parentElement;

        this.styleElement = this.options.forceNewNode
            ? this.createStyleElement()
            : this.getStyleElement();

        if (!this.options.appendBefore) {
            this.parentElement.appendChild(this.styleElement);
        } else {
            this.parentElement.insertBefore(
                this.styleElement,
                this.parentElement.querySelector<HTMLStyleElement>(
                    `style[${this.options.appendBefore}]`,
                ),
            );
        }
    }

    register(id: string, styles: string, isGlobal?: boolean) {
        if (this.has(id)) return;

        const selector = !isGlobal ? id : ``;
        const processedStyles = stylis(selector, styles);

        if (process.env.NODE_ENV === 'development') {
            const styleNode = document.createTextNode(`${processedStyles}\n`);
            const mountedStyles = this.styleElement.getAttribute(
                this.attributeId,
            );

            this.styleElement.appendChild(styleNode);
            this.styleElement.setAttribute(
                this.attributeId,
                `${mountedStyles} ${id}`.trim(),
            );
        } else {
            parse(processedStyles).forEach(styles => {
                // @ts-ignore
                this.styleElement.sheet.insertRule(
                    styles,
                    // @ts-ignore
                    this.styleElement.sheet.cssRules.length,
                );
            });
        }
    }

    has(id: string): boolean {
        const mountedStyles = this.styleElement.getAttribute(this.attributeId);

        return mountedStyles!.includes(id);
    }

    clear() {
        this.styleElement.remove();
    }

    private getStyleElement(): HTMLStyleElement {
        const element = this.parentElement.querySelector<HTMLStyleElement>(
            `style[${this.attributeId}]`,
        );

        return !!element ? element : this.createStyleElement();
    }

    private createStyleElement(): HTMLStyleElement {
        const element = document.createElement<'style'>('style');
        element.setAttribute(this.attributeId, '');
        element.setAttribute('type', 'text/css');
        element.type = 'text/css';
        element.appendChild(document.createTextNode(''));

        return element;
    }
}

export default Registry;
