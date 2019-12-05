import { StyleDefinition, Predicate, Expression } from './types';
import { generateHash } from './common';

export class StyleCollector<Props, State, Theme> {
    private styleDefinitions: StyleDefinition<Props, State, Theme>[] = [];

    constructor(private elementName: string) {}

    element(styles: TemplateStringsArray, ...expressions: Expression<Theme>[]) {
        return this.registerStyles(
            styles,
            expressions,
            `${this.elementName}__`,
        );
    }

    modifier(
        predicate: Predicate<Props, State>,
    ): (
        styles: TemplateStringsArray,
        ...expressions: Expression<Theme>[]
    ) => this;

    modifier(
        id: string,
        predicate: Predicate<Props, State>,
    ): (
        styles: TemplateStringsArray,
        ...expressions: Expression<Theme>[]
    ) => this;

    modifier(
        idOrPredicate: string | Predicate<Props, State>,
        predicate?: Predicate<Props, State>,
    ) {
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
        predicate: Predicate<Props, State> = () => true,
        id: string = '',
    ) {
        let hash = id + this.getHash(styles).toString();

        this.styleDefinitions.push({
            hash,
            styles,
            expressions,
            predicate,
            name,
        });

        return this;
    }
}

export default function styleCollector<Props = {}, State = {}, Theme = {}>(
    elementName: string,
) {
    return new StyleCollector<Props, State, Theme>(elementName);
}
