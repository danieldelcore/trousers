import { Collector } from '@trousers/core';

declare module 'react' {
    interface DOMAttributes<T> {
        css?: ReturnType<Collector>;
        [key: string]: any; // Will need to use template literal types in ts 4.1
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            css?: ReturnType<Collector>;
            [key: string]: any; // Will need to use template literal types in ts 4.1
        }
    }
}
