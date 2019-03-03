import stylis from 'stylis';

class StyleRegistry {
    private parentElement!: HTMLElement;
    private styleElement!: HTMLStyleElement;
    private styles: string[] = [];

    constructor(element: HTMLElement, attributeId: string) {
        this.mount(element, attributeId);
    }

    register(id: string, styles: string) {
        if (this.has(id)) return;

        const processedStyles = stylis(id, styles);
        const styleNode = document.createTextNode(processedStyles);

        this.styleElement.appendChild(styleNode);
        this.styles.push(id);
    }

    has(id: string): boolean {
        return this.styles.includes(id);
    }

    private mount(element: HTMLElement, attributeId: string) {
        this.parentElement = element;

        const styleElement: HTMLStyleElement | null = this.parentElement
            .querySelector(`style[${attributeId}]`);

        if (!styleElement) {
            this.styleElement = document.createElement('style');
            this.styleElement.setAttribute(attributeId, '');
            this.styleElement.type = 'text/css';
        } else {
            this.styleElement = styleElement;
        }

        this.parentElement.appendChild(this.styleElement);
    }
}

export default StyleRegistry;
