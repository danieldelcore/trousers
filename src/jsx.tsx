import { createElement, hasOwnProperty, ElementType, ReactNode } from 'react';
import { StyleCollector, SingleStyleCollector } from './';
import useStyles from './useStyles';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicAttributes {
            css?: StyleCollector<any> | SingleStyleCollector<any>;
        }
    }
}

declare module 'react' {
    interface DOMAttributes<T> {
        css?: StyleCollector<any> | SingleStyleCollector<any>;
    }
}

const jsx = <
    P extends { css: StyleCollector<Theme> | SingleStyleCollector<Theme> },
    Theme extends {} = {}
>(
    type: ElementType<P>,
    props: P,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css')) {
        return createElement(type, props, ...children);
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const className = useStyles<Theme>(props.css);

    return createElement(type, { ...props, className }, ...children);
};

export default jsx;