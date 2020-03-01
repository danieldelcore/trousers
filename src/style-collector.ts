import { StyleDefinition, Predicate, Expression } from './types';
import { generateHash } from './common';

export class StyleCollector<Theme = {}> {
    private styleDefinitions: StyleDefinition<Theme>[] = [];

    constructor(private elementName: string) {}

    element(styles: TemplateStringsArray, ...expressions: Expression<Theme>[]) {
        return this.registerStyles(
            styles,
            expressions,
            `${this.elementName}__`,
            true,
        );
    }

    modifier(
        predicate: Predicate,
    ): (
        styles: TemplateStringsArray,
        ...expressions: Expression<Theme>[]
    ) => this;

    modifier(
        id: string,
        predicate: Predicate,
    ): (
        styles: TemplateStringsArray,
        ...expressions: Expression<Theme>[]
    ) => this;

    modifier(idOrPredicate: string | Predicate, predicate?: Predicate) {
        let id: string;

        if (typeof idOrPredicate === 'string') {
            id = idOrPredicate;
        } else {
            predicate = idOrPredicate;
        }

        return (
            styles: TemplateStringsArray,
            ...expressions: Expression<Theme>[]
        ) =>
            this.registerStyles(
                styles,
                expressions,
                `${this.elementName}--`,
                predicate,
                id,
            );
    }

    get() {
        return this.styleDefinitions;
    }

    private getHash(styles: TemplateStringsArray) {
        const key = styles.reduce((accum, style) => `${accum}${style}`, '');

        return generateHash(key);
    }

    private registerStyles(
        styles: TemplateStringsArray,
        expressions: Expression<Theme>[],
        name: string,
        predicate: Predicate,
        id: string = '',
    ) {
        let hash = id + this.getHash(styles).toString();

        this.styleDefinitions.push({
            hash,
            styles,
            expressions,
            predicate: !!predicate,
            name,
        });

        return this;
    }
}

export default function styleCollector<Theme = {}>(elementName: string) {
    return new StyleCollector<Theme>(elementName);
}
