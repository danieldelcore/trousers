import stylis from 'stylis';

import StyleRegistryInterface from './style-registry-interface';

class ServerRegistry implements StyleRegistryInterface {
    private styles: Map<string, string> = new Map();

    register(id: string, styles: string) {
        if (this.has(id)) return;

        const processedStyles = stylis(id, styles);

        this.styles.set(id, processedStyles);
    }

    has(id: string): boolean {
        return this.styles.has(id);
    }

    get(): string {
        let renderedStyles = '';

        this.styles.forEach((value) => {
            renderedStyles = `${renderedStyles}\n${value}`;
        });

        return renderedStyles;
    }
}

export default ServerRegistry;
