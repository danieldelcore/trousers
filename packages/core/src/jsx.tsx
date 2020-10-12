import './global-types';
import {
    createElement,
    hasOwnProperty,
    ElementType,
    ReactNode,
    useLayoutEffect,
} from 'react';

import parse from './parse';
import prefix from './prefix';
import sheet from './sheet';

import { Collector } from './css';

const jsx = <
    Props extends {
        css: ReturnType<Collector>;
        theme?: string;
        primary: boolean;
    }
>(
    type: ElementType<Omit<Props, 'css' | 'theme' | 'primary'>>,
    props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css')) {
        return createElement(type, props, ...children);
    }

    const { css, theme, primary, ...rest } = props;
    const definitions = css
        ._get()
        .filter(({ id, type }) => type !== 'modifier' || !!(props as any)[id]);
    const classes = definitions
        .map(({ className }) => className)
        .join(' ')
        .trim();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const styleSheet = sheet(headElement, 'data-trousers');

        definitions
            .filter(({ className }) => !styleSheet.has(className))
            .forEach(({ className, styles }) => {
                if (!styleSheet.has(className)) {
                    const styleString = parse(styles);
                    const prefixedStyles = prefix(`.${className}`, styleString);
                    styleSheet.mount(className, prefixedStyles, false);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    // TODO: Zero config ssr https://github.com/emotion-js/emotion/blob/master/packages/core/src/jsx.js

    return createElement(
        type,
        {
            ...rest,
            className: theme ? theme + ' ' + classes : classes,
        },
        ...children,
    );
};

export default jsx;
