export type Predicate = boolean;
export type Expression<Theme> =
    | string
    | number
    | ((theme: Theme) => string | number);

export interface TaggedTemplate<Theme> {
    styles: TemplateStringsArray;
    expressions: Expression<Theme>[];
}

export interface StyleDefinition<Theme> extends TaggedTemplate<Theme> {
    hash: string;
    predicate: Predicate;
    name: string;
}
