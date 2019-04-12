import stylis from 'stylis';

import StyleRegistryInterface from './style-registry-interface';

class StyleRegistry implements StyleRegistryInterface {
    private parentElement!: HTMLElement;
    private styleElement!: HTMLStyleElement;
    private globalElement!: HTMLStyleElement;
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

    registerGlobal(styles: string) {
        const processedStyles = stylis('', styles);
        const styleNode = document.createTextNode(processedStyles);

        this.globalElement = this.mount(true);
        this.globalElement.appendChild(styleNode);
        this.parentElement.insertBefore(this.globalElement, this.styleElement);
    }

    has(id: string): boolean {
        const mountedStyles = this.styleElement.getAttribute(this.attributeId);

        return mountedStyles!.includes(id);
    }

    clear(isGlobal?: boolean) {
        if (isGlobal) {
            this.globalElement.remove();
        } else {
            this.styleElement.remove();
        }
    }

    private mount(isGlobal?: boolean) {
        const attr = isGlobal ? `${this.attributeId}-global` : this.attributeId;
        let styleElement: HTMLStyleElement | null = this.parentElement.querySelector(
            `style[${attr}]`,
        );

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.setAttribute(attr, '');
            styleElement.type = 'text/css';
        }

        return styleElement;
    }
}

export default StyleRegistry;
