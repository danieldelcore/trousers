import { useContext, useLayoutEffect } from 'react';

import { SingleStyleCollector } from './';
import { GLOBAL_STYLE_ID, STYLE_ID } from './constants';
import { interpolateStyles, isBrowser } from './common';
import { StyleRegistry, ServerStyleRegistry } from './styles';
import { ThemeContext, ThemeCtx, ServerContext, ServerCtx } from './';

function getStyles<Theme>(
    styleCollector: SingleStyleCollector<Theme>,
    theme: Theme,
): Record<string, string> {
    const styleDefinition = styleCollector.get()[0];
    const styles = interpolateStyles(
        styleDefinition.styles,
        styleDefinition.expressions,
        theme,
    );

    return {
        id: styleDefinition.hash.toString(),
        styles,
    };
}

function registerGlobals<Theme>(
    styleCollectors:
        | SingleStyleCollector<Theme>
        | SingleStyleCollector<Theme>[],
    theme: Theme,
    registry: StyleRegistry | ServerStyleRegistry,
) {
    [...styleCollectors].forEach(styleCollector => {
        const { id, styles } = getStyles<Theme>(styleCollector, theme);
        registry.register(id, styles, true);
    });
}

export default function useGlobal<Theme>(
    styleCollectors:
        | SingleStyleCollector<Theme>
        | SingleStyleCollector<Theme>[],
) {
    const { theme } = useContext<ThemeCtx>(ThemeContext);
    const { serverStyleRegistry } = useContext<ServerCtx>(ServerContext);

    if (!isBrowser() && !!serverStyleRegistry) {
        registerGlobals<Theme>(
            styleCollectors,
            theme as Theme,
            serverStyleRegistry,
        );

        return;
    }

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const registry = new StyleRegistry(headElement, GLOBAL_STYLE_ID, {
            forceNewNode: true,
            appendBefore: STYLE_ID,
        });

        registerGlobals<Theme>(styleCollectors, theme as Theme, registry);

        return () => registry.clear();
    }, [theme, styleCollectors]);
}
