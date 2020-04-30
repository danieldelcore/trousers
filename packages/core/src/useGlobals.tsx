import { useContext, useLayoutEffect } from 'react';

import {
    StyleCollector,
    GLOBAL_STYLE_ID,
    STYLE_ID,
    CSSProps,
} from '@trousers/utils';
import { registry, Registry } from '@trousers/registry';
import { ThemeContext, ThemeCtx } from '@trousers/theme';
import { ServerContext, ServerCtx } from '@trousers/server';
import { parseObject } from '@trousers/parser';

import { interpolateStyles, isBrowser } from './common';
import css from './css';

function registerGlobals<Theme>(
    styleCollectors:
        | StyleCollector<Theme>
        | StyleCollector<Theme>[]
        | CSSProps
        | CSSProps[],
    theme: Theme,
    registry: Registry,
) {
    const collectors =
        styleCollectors instanceof Array ? styleCollectors : [styleCollectors];

    collectors.forEach(collector => {
        const parsedCollector = !(collector as StyleCollector<Theme>).get
            ? css([parseObject(collector)])
            : (collector as StyleCollector<Theme>);

        const styleDefinition = parsedCollector.get()[0];
        const styles = interpolateStyles(
            styleDefinition.styles,
            styleDefinition.expressions,
            theme,
        );

        registry.register(styleDefinition.hash.toString(), styles, true);
    });
}

export default function useGlobals<Theme>(
    styleCollectors:
        | StyleCollector<Theme>
        | StyleCollector<Theme>[]
        | CSSProps
        | CSSProps[],
) {
    const { theme } = useContext<ThemeCtx>(ThemeContext);
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    if (!isBrowser() && !!serverStyleRegistry) {
        registerGlobals(styleCollectors, theme as Theme, serverStyleRegistry);
    }

    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const clientRegistry = registry(headElement, GLOBAL_STYLE_ID, {
            forceNewNode: true,
            appendBefore: STYLE_ID,
        });

        registerGlobals<Theme>(styleCollectors, theme as Theme, clientRegistry);

        return () => clientRegistry.clear();
    }, [theme, styleCollectors]);
}
