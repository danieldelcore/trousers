import React, { FC, createElement, useLayoutEffect, Fragment } from 'react';

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

const TrousersNested: FC<TrousersProps> = props => {
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
        props.children,
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

export default TrousersNested;
