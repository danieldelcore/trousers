import './global-types';
import React, {
    createElement,
    hasOwnProperty,
    ElementType,
    ReactNode,
    useLayoutEffect,
    Fragment,
} from 'react';

import { Collector, process, isBrowser } from '@trousers/core';
import sheet from '@trousers/sheet';

let styleSheet: ReturnType<typeof sheet> | null = null;
if (isBrowser()) {
    const headElement = document.getElementsByTagName('head')[0];
    styleSheet = sheet(headElement, 'data-trousers');
}

const jsx = <
    Props extends {
        css: ReturnType<Collector>;
        [key: string]: any;
    }
>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css'))
        return createElement(type, props, ...children);

    const definitions = props.css
        ._get()
        .filter(
            ({ id, type }) =>
                type !== 'modifier' ||
                (props.hasOwnProperty(`$${id}`) && !!props[`$${id}`]),
        );

    const classes = definitions
        .map(({ className }) => className)
        .join(' ')
        .trim();

    const cleanProps = Object.keys(props)
        .filter(key => !key.startsWith('$') && key !== 'css')
        .reduce((obj: Record<string, any>, key: string) => {
            obj[key] = props[key];
            return obj;
        }, {});

    const Element = createElement(
        type,
        // @ts-ignore
        {
            ...cleanProps,
            className: classes,
        },
        ...children,
    );

    if (!isBrowser()) {
        const styles = definitions
            .map(({ className, styles }) =>
                Object.entries(process(`.${className}`, styles)).reduce(
                    (accum, [key, value]) => `${accum}${key} {${value}}`,
                    '',
                ),
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
        definitions
            .filter(
                ({ className }) =>
                    styleSheet && !styleSheet.has(`.${className}`),
            )
            .forEach(({ className, styles }) => {
                Object.entries(process(`.${className}`, styles)).forEach(
                    ([key, value]) =>
                        styleSheet &&
                        styleSheet.mount(key, `${key}{${value}}`, false),
                );
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    return Element;
};

export default jsx;
