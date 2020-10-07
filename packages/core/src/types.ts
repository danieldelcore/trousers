import { CSSProperties } from 'react';

export interface Definition {
    id: string;
    type: 'element' | 'modifier' | 'theme';
    className: string;
    styles: CSSProperties;
}
