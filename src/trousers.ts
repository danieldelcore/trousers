import { StyleDefinition, Predicate, Expression } from './types';
import { generateHash } from './common';

export class StyleCollector<Props, State, Theme> {
    private styleDefinitions: StyleDefinition<Props, State, Theme>[] = [];

    constructor(private elementId: string) {}

    element(styles: TemplateStringsArray, ...expressions: Expression<Theme>[]) {
        return this.registerStyles(styles, expressions, 'element');
    }

    modifier(predicate: Predicate<Props, State>) {
        return (
            styles: TemplateStringsArray,
            ...expressions: Expression<Theme>[]
        ) => this.registerStyles(styles, expressions, 'modifier', predicate);
    }

    getElementName() {
        return this.elementId;
    }

    get(type?: string): StyleDefinition<Props, State, Theme>[] {
        if (!type) return this.styleDefinitions;

        return this.styleDefinitions.filter(
            (definition: StyleDefinition<Props, State, Theme>) =>
                definition.type === type,
        );
    }

    private registerStyles(
        styles: TemplateStringsArray,
        expressions: Expression<Theme>[],
        type: 'element' | 'modifier',
        predicate?: Predicate<Props, State>,
    ) {
        const key = styles.reduce((accum, style) => `${accum}${style}`, '');
        const hash = generateHash(key);

        this.styleDefinitions.push({
            hash,
            type,
            styles,
            expressions,
            predicate,
        });

        return this;
    }
}

export default function trousers<Props, State, Theme>(elementId: string) {
    return new StyleCollector<Props, State, Theme>(elementId);
}
