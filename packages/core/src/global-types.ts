import { Collector } from './css';

declare module 'react' {
    interface DOMAttributes<T> {
        css?: ReturnType<Collector>;
        primary?: boolean; // TODO: Figure this one out
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            css?: ReturnType<Collector>;
            primary?: boolean; // TODO: Figure this one out
        }
    }
}
