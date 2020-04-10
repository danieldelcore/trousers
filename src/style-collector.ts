import { StyleDefinition, Predicate, Expression } from './types';
import { generateHash } from './common';

const getHash = (styles: TemplateStringsArray) => {
    const key = styles.reduce((accum, style) => `${accum}${style}`, '');

    return generateHash(key).toString();
};

export default function styleCollector<Theme = {}>(elementName: string) {
    const styleDefinitions: StyleDefinition<Theme>[] = [];
    const get = () => styleDefinitions;

    const modifier = (
        idOrPredicate: string | Predicate,
        predicate?: Predicate,
    ) => {
        let id: string;

        if (typeof idOrPredicate === 'string') {
            id = idOrPredicate;
        } else {
            predicate = idOrPredicate;
        }

        return (
            styles: TemplateStringsArray,
            ...expressions: Expression<Theme>[]
        ) => {
            styleDefinitions.push({
                hash: id + getHash(styles),
                styles,
                expressions,
                predicate: !!predicate,
                name: `${elementName}--`,
            });

            return { modifier, get };
        };
    };

    const element = (
        styles: TemplateStringsArray,
        ...expressions: Expression<Theme>[]
    ) => {
        styleDefinitions.push({
            hash: getHash(styles),
            styles,
            expressions,
            predicate: true,
            name: `${elementName}__`,
        });

        return { modifier, get };
    };

    return {
        element,
        modifier,
        get,
    };
}
