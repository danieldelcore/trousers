import stylis from 'stylis';

import RegistryInterface from './registry-interface';

interface RegistryOptions {
    forceNewNode: boolean;
    appendBefore?: string;
}

class Registry implements RegistryInterface {
    private styleElement!: HTMLStyleElement;

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
        const styleNode = document.createTextNode(`${processedStyles}\n`);
        const mountedStyles = this.styleElement.getAttribute(this.attributeId);

        this.styleElement.appendChild(styleNode);
        this.styleElement.setAttribute(
            this.attributeId,
            `${mountedStyles} ${id}`.trim(),
        );
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

        return element;
    }
}

export default Registry;
