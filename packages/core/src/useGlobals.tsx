import { useContext, useLayoutEffect } from 'react';

import {
    StyleCollector,
    GLOBAL_STYLE_ID,
    STYLE_ID,
    CSSProps,
} from '@trousers/utils';
import { registry } from '@trousers/registry';
import { ThemeContext, ThemeCtx } from '@trousers/theme';
import { ServerContext, ServerCtx } from '@trousers/server';
import { parseObject } from '@trousers/parser';
import { toHash } from '@trousers/hash';

import { interpolateStyles, isBrowser } from './common';
import css from './css';

export default function useGlobals<Theme>(
    styleCollectors:
        | StyleCollector<Theme>
        | StyleCollector<Theme>[]
        | CSSProps
        | CSSProps[],
) {
    const { theme } = useContext<ThemeCtx>(ThemeContext);
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);
    const collectors =
        styleCollectors instanceof Array ? styleCollectors : [styleCollectors];

    const activeStyles = collectors.map(collector => {
        const parsedCollector = !(collector as StyleCollector<Theme>).get
            ? css([parseObject(collector)])
            : (collector as StyleCollector<Theme>);

        const definition = parsedCollector.get()[0];
        const styles = interpolateStyles(
            definition.styles,
            definition.expressions,
            theme,
        );

        return {
            hash: toHash(styles).toString(),
            styles,
        };
    });

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    if (!isBrowser() && !!serverStyleRegistry) {
        activeStyles.forEach(({ hash, styles }) => {
            serverStyleRegistry.register(hash, styles, true);
        });
    }

    const hash = activeStyles.reduce((accum, { hash }) => accum + hash, '');

    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const clientRegistry = registry(headElement, GLOBAL_STYLE_ID, {
            forceNewNode: true,
            appendBefore: STYLE_ID,
        });

        activeStyles.forEach(({ hash, styles }) => {
            clientRegistry.register(hash, styles, true);
        });

        return () => clientRegistry.clear();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(theme), hash]);
}
