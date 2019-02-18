import { StyleDefinition, Predicate, Expression } from './types';

export class StyleCollector<Props, Theme> {
    private styleDefinitions: StyleDefinition<Props, Theme>[] = [];

    element(styles: TemplateStringsArray, ...expressions: Expression<Theme>[]) {
        return this.registerStyles(styles, expressions);
    }

    modifier(predicate: Predicate<Props>) {
        return (styles: TemplateStringsArray, ...expressions: Expression<Theme>[]) =>
            this.registerStyles(styles, expressions, predicate);
    }

    get(): StyleDefinition<Props, Theme>[] {
        return this.styleDefinitions;
    }

    private registerStyles(
        styles: TemplateStringsArray,
        expressions: Expression<Theme>[],
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

export default function trousers<Props, Theme>() {
    return new StyleCollector<Props, Theme>();
}
