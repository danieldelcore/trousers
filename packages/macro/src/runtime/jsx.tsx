// todo
import './global-types';
import React, {
    createElement,
    hasOwnProperty,
    ElementType,
    ReactNode,
    useLayoutEffect,
    Fragment,
} from 'react';

import { isBrowser } from '@trousers/core';
import sheet from '@trousers/sheet';

import { TrousersProps } from './types';

let styleSheet: ReturnType<typeof sheet> | null = null;
if (isBrowser()) {
    const headElement = document.getElementsByTagName('head')[0];
    styleSheet = sheet(headElement, 'data-trousers');
}

const jsx = <Props extends TrousersProps>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css'))
        return createElement(type, props, ...children);

    //TODO: might be good to memo here
    const definitions = props
        .css!._get()
        .filter(
            ({ id, type }) =>
                type !== 'modifier' ||
                (props.hasOwnProperty(`$${id}`) && !!props[`$${id}`]),
        );

    const classes = definitions
        .map(({ styles }) => Object.keys(styles)[0].substring(1))
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
            .map(({ styles }) =>
                Object.entries(styles).reduce(
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
        const cleanUp: string[] = [];

        definitions
            .filter(
                ({ styles }) =>
                    styleSheet && !styleSheet.has(Object.keys(styles)[0]),
            ) // this doesn't stop all selectors
            .forEach(({ id, styles, type }) =>
                Object.entries(styles).forEach(([key, value]) => {
                    if (type === 'global') {
                        cleanUp.push(id + key);
                    }

                    return (
                        styleSheet &&
                        styleSheet.mount(
                            id + key,
                            `${key}{${value}}`,
                            type === 'global',
                        )
                    );
                }),
            );

        return () => {
            cleanUp.forEach(id => styleSheet && styleSheet.unmount(id));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    return Element;
};

export default jsx;