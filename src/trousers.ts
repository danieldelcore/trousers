export type Predicate = (...args: any[]) => boolean;

export interface StyleDefinition {
    styles: TemplateStringsArray;
    expressions: any[];
    predicate?: Predicate;
}

export class StyleCollector {
    private styleDefinitions: StyleDefinition[] = [];

    element(styles: TemplateStringsArray, ...expressions: any[]) {
        return this.registerStyles(styles, expressions);
    }

    modifier(predicate: Predicate) {
        return (styles: TemplateStringsArray, ...expressions: any[]) =>
            this.registerStyles(styles, expressions, predicate);
    }

    get(): StyleDefinition[] {
        return this.styleDefinitions;
    }

    private registerStyles(
        styles: TemplateStringsArray,
        expressions: any[],
        predicate?: Predicate,
    ) {
        this.styleDefinitions.push({
            styles,
            expressions,
            predicate,
        });

        return this;
    }
}

export default function trousers() {
    return new StyleCollector();
}
