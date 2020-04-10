import { createElement, hasOwnProperty, ElementType, ReactNode } from 'react';
import { StyleCollector } from './';
import useStyles from './useStyles';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicAttributes {
            css?: StyleCollector<any>;
        }
    }
}

declare module 'react' {
    interface DOMAttributes<T> {
        css?: StyleCollector<any>;
    }
}

const jsx = <
    Props extends { css: StyleCollector<Theme> },
    Theme extends {} = {}
>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css')) {
        return createElement(type, props, ...children);
    }

    const { css, ...rest } = props;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const className = useStyles<Theme>(props.css);

    return createElement(type, { ...rest, className }, ...children);
};

export default jsx;
