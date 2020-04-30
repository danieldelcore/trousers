import { createElement, hasOwnProperty, ElementType, ReactNode } from 'react';

import { StyleCollector, CSSProps } from '@trousers/utils';
import useStyles from './useStyles';

import './types';

const jsx = <
    Props extends { css: StyleCollector<Theme> | CSSProps },
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
export { CSSProps };
