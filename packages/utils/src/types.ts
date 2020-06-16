import { CSSProperties } from 'react';

export type Predicate = boolean | undefined | null;
export type Expression<Theme> =
    | string
    | number
    | ((theme: Theme) => string | number);

export interface TaggedTemplate<Theme> {
    styles: TemplateStringsArray | string[];
    expressions: Expression<Theme>[];
}

export interface StyleDefinition<Theme> extends TaggedTemplate<Theme> {
    predicate: Predicate;
    name: string;
}

export interface StyleCollector<Theme = {}> {
    get: () => StyleDefinition<Theme>[];
}

export type CSSProps = CSSProperties | { [key: string]: CSSProperties };
