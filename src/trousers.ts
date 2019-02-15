export type Predicate<Props> = (props: Props) => boolean;

export interface StyleDefinition<Props> {
    styles: TemplateStringsArray;
    expressions: any[];
    predicate?: Predicate<Props>;
}

export class StyleCollector<Props> {
    private styleDefinitions: StyleDefinition<Props>[] = [];

    element(styles: TemplateStringsArray, ...expressions: any[]) {
        return this.registerStyles(styles, expressions);
    }

    modifier(predicate: Predicate<Props>) {
        return (styles: TemplateStringsArray, ...expressions: any[]) =>
            this.registerStyles(styles, expressions, predicate);
    }

    get(): StyleDefinition<Props>[] {
        return this.styleDefinitions;
    }

    private registerStyles(
        styles: TemplateStringsArray,
        expressions: any[],
        predicate?: Predicate<Props>,
    ) {
        this.styleDefinitions.push({
            styles,
            expressions,
            predicate,
        });

        return this;
    }
}

export default function trousers<Props>() {
    return new StyleCollector<Props>();
}
