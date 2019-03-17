export type Predicate<Props> = (props: Props) => boolean;
export type Expression<Theme> =
    | string
    | number
    | ((theme: Theme) => string | number);

export interface TaggedTemplate<Theme> {
    styles: TemplateStringsArray;
    expressions: Expression<Theme>[];
}

export interface StyleDefinition<Props, Theme> extends TaggedTemplate<Theme> {
    hash: number;
    type: 'element' | 'modifier';
    predicate?: Predicate<Props>;
}
