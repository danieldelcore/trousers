export type Predicate<Props> = (props: Props) => boolean;
export type Expression<Theme> = string | number | ((theme: Theme) => string | number);

export default interface StyleDefinition<Props, Theme> {
    hash: number;
    type: 'element' | 'modifier';
    styles: TemplateStringsArray;
    expressions: Expression<Theme>[];
    predicate?: Predicate<Props>;
}
