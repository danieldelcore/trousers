import React, {
    createElement,
    hasOwnProperty,
    ElementType,
    ReactNode,
    useLayoutEffect,
    Fragment,
} from 'react';

import { isBrowser } from '@trousers/core';
import Sheet from '@trousers/sheet';

import { CollectorReturn } from './css';

export interface TrousersProps {
    css?: CollectorReturn;
    [key: string]: any; // Will need to use template literal types in ts 4.1
}

let sheet: ReturnType<typeof Sheet> | null = null;
if (isBrowser()) {
    const headElement = document.getElementsByTagName('head')[0];
    sheet = Sheet(headElement, 'data-trousers');
}

const TrousersNested = <P extends TrousersProps = {}>(props: P) => {
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
        .filter(
            key =>
                !key.startsWith('$') &&
                key !== 'css' &&
                key !== 'elementType' &&
                key !== 'children',
        )
        .reduce((obj: Record<string, any>, key: string) => {
            obj[key] = props[key];
            return obj;
        }, {});

    const Element = createElement(
        props.elementType,
        {
            ...cleanProps,
            className: classes,
        },
        ...props.children,
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
            .filter(({ styles }) => sheet && !sheet.has(Object.keys(styles)[0])) // this doesn't stop all selectors
            .forEach(({ id, styles, type }) =>
                Object.entries(styles).forEach(([key, value]) => {
                    if (type === 'global') {
                        cleanUp.push(id + key);
                    }

                    return (
                        sheet &&
                        sheet.mount(
                            id + key,
                            `${key}{${value}}`,
                            type === 'global',
                        )
                    );
                }),
            );

        return () => {
            cleanUp.forEach(id => sheet && sheet.unmount(id));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    return Element;
};

const jsx = <Props extends TrousersProps>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css'))
        return createElement(type, props, ...children);

    return (
        // @ts-ignore css props clash due to global declaration
        <TrousersNested<Props> {...props} elementType={type}>
            {children}
        </TrousersNested>
    );
};

export default jsx;
