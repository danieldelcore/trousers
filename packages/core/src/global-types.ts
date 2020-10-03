import { Collector } from './css';

declare module 'react' {
    interface DOMAttributes<T> {
        css?: ReturnType<Collector>;
        theme?: string;
        primary?: boolean;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            css?: ReturnType<Collector>;
            theme?: string;
            primary?: boolean;
        }
    }
}
