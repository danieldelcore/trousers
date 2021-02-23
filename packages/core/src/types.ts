import * as CSS from 'csstype';

type CSSProperties = CSS.PropertiesFallback<number | string>;
type CSSPropertiesWithMultiValues = {
    [K in keyof CSSProperties]:
        | CSSProperties[K]
        | Extract<CSSProperties[K], string>[];
};

type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };

type InterpolationPrimitive =
    | null
    | undefined
    | boolean
    | number
    | string
    | CSSObject;

type CSSInterpolation = InterpolationPrimitive | CSSInterpolation[];

interface CSSOthersObject {
    [propertiesName: string]: CSSInterpolation;
}

export interface CSSObject
    extends CSSPropertiesWithMultiValues,
        CSSPseudos,
        CSSOthersObject {}

export interface Definition {
    id: string;
    type: 'element' | 'modifier' | 'theme' | 'global';
    className: string;
    styles: CSSObject;
}
