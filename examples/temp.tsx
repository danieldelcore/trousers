import { CSSProperties } from 'react';
import { Collector } from './v4-proto';

declare module 'react' {
    interface DOMAttributes<T> {
        css?: CSSProperties | ReturnType<Collector>;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            css?: CSSProperties | ReturnType<Collector>;
        }
    }
}
