import React, { ReactNode, ReactChild } from 'react';
import stylis from 'stylis';

import { STYLE_ID, GLOBAL_STYLE_ID } from '@trousers/utils';
import { Registry } from '@trousers/registry';

export type ServerRegistry = Registry & { get: () => ReactNode };

const serverRegistry = (): ServerRegistry => {
    const globalMap = new Map<string, string>();
    const styleMap = new Map<string, string>();
    const has = (id: string) => styleMap.has(id);

    const clear = () => {};
    const register = (id: string, style: string, isGlobal?: boolean) => {
        if (has(id)) return;

        const selector = !isGlobal ? id : ``;
        const processedStyles: string = stylis(selector, style);

        if (!isGlobal) {
            styleMap.set(id, processedStyles);
        } else {
            globalMap.set(id, processedStyles);
        }
    };

    const renderStyles = () => {
        const ids: string[] = [];
        const styles: string[] = [];

        styleMap.forEach((value, key) => {
            ids.push(key);
            styles.push(value);
        });

        return (
            <style
                {...{
                    [STYLE_ID]: ids.toString(),
                }}
            >
                {styles.join('\n')}
            </style>
        );
    };

    const renderGlobals = () => {
        const styles: ReactChild[] = [];

        globalMap.forEach((value, key) => {
            styles.push(
                <style
                    {...{
                        [GLOBAL_STYLE_ID]: key,
                    }}
                >
                    {value}
                </style>,
            );
        });

        return styles;
    };

    const get = () => [...renderGlobals(), renderStyles()];

    return {
        get,
        has,
        clear,
        register,
    };
};

export default serverRegistry;
