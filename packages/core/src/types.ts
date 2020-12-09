import * as CSS from 'csstype';
import { CollectorReturn } from './css';

type CSSProperties = CSS.PropertiesFallback<number | string>;
type CSSPropertiesWithMultiValues = {
    [K in keyof CSSProperties]:
        | CSSProperties[K]
        | Extract<CSSProperties[K], string>[];
};

type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject };

export interface CSSObject extends CSSPropertiesWithMultiValues, CSSPseudos {}

export interface Definition {
    id: string;
    type: 'element' | 'modifier' | 'theme' | 'global';
    className: string;
    styles: CSSObject;
}

// eslint-disable-next-line @typescript-eslint/prefer-interface
export type TrousersProps = {
    css?: CollectorReturn;
    [key: string]: any; // Will need to use template literal types in ts 4.1
};
