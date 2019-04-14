export type Predicate<Props, State> = (props?: Props, state?: State) => boolean;
export type Expression<Theme> =
    | string
    | number
    | ((theme: Theme) => string | number);

export interface TaggedTemplate<Theme> {
    styles: TemplateStringsArray;
    expressions: Expression<Theme>[];
}

export interface StyleDefinition<Props, State, Theme>
    extends TaggedTemplate<Theme> {
    hash: number;
    predicate: Predicate<Props, State>;
    separator?: string;
}
