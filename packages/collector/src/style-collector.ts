import { StyleDefinition, Predicate, Expression } from '@trousers/utils';

export default function styleCollector<Theme = {}>(elementName: string) {
    const styleDefinitions: StyleDefinition<Theme>[] = [];
    const get = () => styleDefinitions;

    const modifier = (
        idOrPredicate: string | Predicate,
        predicate?: Predicate,
    ) => (
        styles: TemplateStringsArray,
        ...expressions: Expression<Theme>[]
    ) => {
        let id = '';

        if (typeof idOrPredicate === 'string') {
            id = idOrPredicate;
        } else {
            predicate = idOrPredicate;
        }

        styleDefinitions.push({
            styles,
            expressions,
            predicate: !!predicate,
            name: `${elementName}--${id}`,
        });

        return { modifier, get };
    };

    const element = (
        styles: TemplateStringsArray,
        ...expressions: Expression<Theme>[]
    ) => {
        styleDefinitions.push({
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
