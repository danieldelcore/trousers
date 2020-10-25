import * as CSS from 'csstype';

type CSSProperties = CSS.PropertiesFallback<number | string>;
type CSSPropertiesWithMultiValues = {
    [K in keyof CSSProperties]:
        | CSSProperties[K]
        | Extract<CSSProperties[K], string>[];
};
export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };

export interface CSSObject extends CSSPropertiesWithMultiValues, CSSPseudos {}

export interface Definition {
    id: string;
    type: 'element' | 'modifier' | 'theme';
    className: string;
    styles: CSSObject;
}
