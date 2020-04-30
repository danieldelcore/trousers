import { StyleCollector, CSSProps } from '@trousers/utils';

declare module 'react' {
    interface DOMAttributes<T> {
        css?: StyleCollector<any> | CSSProps;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            css?: StyleCollector<any> | CSSProps;
        }
    }
}
