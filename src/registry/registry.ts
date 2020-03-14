import stylis from 'stylis';

import { arrayToMatrix } from '../common';
import styleSheet from '../style-sheet';
import RegistryInterface from './registry-interface';

class Registry implements RegistryInterface {
    sheet: CSSStyleSheet;
    registry: Map<string, number>;

    constructor(private attributeId: string) {
        this.sheet = styleSheet({ [this.attributeId]: '' });
        this.registry = new Map();
    }

    register(id: string, styles: string, isGlobal?: boolean): number {
        if (this.has(id)) {
            return this.registry.get(id)!;
        }

        const selector = !isGlobal ? id : ``;

        const processedStyles: string[] = stylis(selector, styles)
            .split(/\{([^\}]+)\}/)
            .filter((style: string) => !!style);

        // TODO - remove this stuff and just iterate over the processedStyles array
        // @ts-ignore
        const styleMatrix = Object.fromEntries(
            arrayToMatrix(processedStyles, 2),
        );

        Object.keys(styleMatrix).forEach(key => {
            this.sheet.insertRule(`${key} {${styleMatrix[key]}}`);
        });

        console.log('inserting: ', id, this.sheet.cssRules.length);

        this.registry.set(id, this.sheet.cssRules.length);

        return this.sheet.cssRules.length;
    }

    has(id: string): boolean {
        return this.registry.has(id);
    }

    clear(id: string) {
        const index = this.registry.get(id);
        this.registry.delete(id);
        this.sheet.deleteRule(index);
    }
}

export default Registry;
