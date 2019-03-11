import stylis from 'stylis';

import { RegistryInterface } from './registry-interface';

class ServerRegistry implements RegistryInterface {
    private styles: string[] = [];

    constructor(attributeId: string) {}

    register(id: string, styles: string) {
        if (this.has(id)) return;

        const processedStyles = stylis(id, styles);
        // const styleNode = document.createTextNode(processedStyles);

        this.styles.push(id);
    }

    has(id: string): boolean {
        return this.styles.includes(id);
    }
}

export default ServerRegistry;
