import stylis from 'stylis';

import StyleRegistryInterface from './style-registry-interface';

class ServerRegistry implements StyleRegistryInterface {
    private styles: Map<string, string> = new Map();

    register(id: string, styles: string) {
        if (this.has(id)) return;

        const processedStyles = stylis(id, styles);

        this.styles.set(id, processedStyles);
    }

    registerGlobal(styles: string) {
        const processedStyles = stylis('', styles);

        this.styles.set('', processedStyles);
    }

    has(id: string): boolean {
        return this.styles.has(id);
    }

    get(): string {
        let renderedStyles = '';
        let globalStyles = '';

        this.styles.forEach((value, key) => {
            if (!key) {
                globalStyles = `${globalStyles}\n${value}\n`;
            } else {
                renderedStyles = `${renderedStyles}\n${value}`;
            }
        });

        return `${globalStyles}${renderedStyles}`;
    }

    clear() {}
}

export default ServerRegistry;
