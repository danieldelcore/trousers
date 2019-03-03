import { StyleDefinition, Predicate, Expression } from './types';
import { generateHash } from './common';

export class StyleCollector<Props, Theme> {
    private styleDefinitions: StyleDefinition<Props, Theme>[] = [];

    element(styles: TemplateStringsArray, ...expressions: Expression<Theme>[]) {
        return this.registerStyles(styles, expressions, 'element');
    }

    modifier(predicate: Predicate<Props>) {
        return (styles: TemplateStringsArray, ...expressions: Expression<Theme>[]) =>
            this.registerStyles(styles, expressions, 'modifier', predicate);
    }

    get(): StyleDefinition<Props, Theme>[] {
        return this.styleDefinitions;
    }

    private registerStyles(
        styles: TemplateStringsArray,
        expressions: Expression<Theme>[],
        type: 'element' | 'modifier',
        predicate?: Predicate<Props>,
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

export default function trousers<Props, Theme>() {
    return new StyleCollector<Props, Theme>();
}
