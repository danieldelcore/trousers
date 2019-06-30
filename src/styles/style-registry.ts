import stylis from 'stylis';

import StyleRegistryInterface from './style-registry-interface';

class StyleRegistry implements StyleRegistryInterface {
    private parentElement!: HTMLElement;
    private styleElement!: HTMLStyleElement;
    private attributeId: string;

    constructor(element: HTMLElement, attributeId: string) {
        this.attributeId = attributeId;
        this.parentElement = element;

        this.styleElement = this.mount();
        this.parentElement.appendChild(this.styleElement);
    }

    register(id: string, styles: string) {
        if (this.has(id)) return;

        const processedStyles = stylis(id, styles);
        const styleNode = document.createTextNode(processedStyles);
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

    private mount() {
        let styleElement: HTMLStyleElement | null = this.parentElement.querySelector(
            `style[${this.attributeId}]`,
        );

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.setAttribute(this.attributeId, '');
            styleElement.type = 'text/css';
        }

        return styleElement;
    }
}

export default StyleRegistry;
