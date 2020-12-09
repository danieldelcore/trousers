/* eslint-disable @typescript-eslint/no-empty-interface */
import { TrousersProps } from '@trousers/core';

declare module 'react' {
    interface DOMAttributes<T> extends TrousersProps {}
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes extends TrousersProps {}
    }
}
