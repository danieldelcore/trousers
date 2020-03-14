import { useContext, useLayoutEffect } from 'react';

import { SingleStyleCollector } from './';
import { GLOBAL_STYLE_ID, STYLE_ID } from './constants';
import { interpolateStyles, isBrowser } from './common';
import { Registry, ServerRegistry } from './registry';
import { ThemeContext, ThemeCtx, ServerContext, ServerCtx } from './';

function registerGlobals<Theme>(
    styleCollectors:
        | SingleStyleCollector<Theme>
        | SingleStyleCollector<Theme>[],
    theme: Theme,
    registry: Registry | ServerRegistry,
) {
    [...styleCollectors].forEach(styleCollector => {
        const styleDefinition = styleCollector.get()[0];
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
        | SingleStyleCollector<Theme>
        | SingleStyleCollector<Theme>[],
) {
    const { theme } = useContext<ThemeCtx>(ThemeContext);
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);

    if (!isBrowser() && !!serverStyleRegistry) {
        registerGlobals(styleCollectors, theme as Theme, serverStyleRegistry);
    }

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const registry = new Registry(headElement, GLOBAL_STYLE_ID, {
            forceNewNode: true,
            appendBefore: STYLE_ID,
        });

        registerGlobals<Theme>(styleCollectors, theme as Theme, registry);

        return () => registry.clear();
    }, [theme, styleCollectors]);
}
