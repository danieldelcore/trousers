import './global-types';
import React, {
    createElement,
    hasOwnProperty,
    ElementType,
    ReactNode,
    useLayoutEffect,
    Fragment,
} from 'react';

import { Collector, parse, prefix, isBrowser } from '@trousers/core';
import sheet from '@trousers/sheet';

const jsx = <
    Props extends {
        css: ReturnType<Collector>;
        primary: boolean;
    }
>(
    type: ElementType<Omit<Props, 'css' | 'primary'>>,
    props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css')) {
        return createElement(type, props, ...children);
    }

    const { css, primary, ...rest } = props;
    const definitions = css
        ._get()
        .filter(({ id, type }) => type !== 'modifier' || !!(props as any)[id]);
    const classes = definitions
        .map(({ className }) => className)
        .join(' ')
        .trim();

    const Element = createElement(
        type,
        {
            ...rest,
            className: classes,
        },
        ...children,
    );

    if (!isBrowser()) {
        const styles = definitions
            .map(({ className, styles }) =>
                prefix(`.${className}`, parse(styles)),
            )
            .join('\n');

        return (
            <Fragment>
                <style dangerouslySetInnerHTML={{ __html: styles }} />
                {Element}
            </Fragment>
        );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const styleSheet = sheet(headElement, 'data-trousers');

        definitions
            .filter(({ className }) => !styleSheet.has(className))
            .forEach(({ className, styles }) => {
                const styleString = parse(styles);
                const prefixedStyles = prefix(`.${className}`, styleString);
                styleSheet.mount(className, prefixedStyles, false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    return Element;
};

export default jsx;
