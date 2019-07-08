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

export default function useGlobal<Theme>(
    styleCollector: SingleStyleCollector<Theme>,
) {
    const { theme } = useContext<ThemeCtx>(ThemeContext);
    const { serverStyleRegistry } = useContext<ServerCtx>(ServerContext);

    if (!isBrowser() && !!serverStyleRegistry) {
        const { id, styles } = getStyles<Theme>(styleCollector, theme as Theme);
        serverStyleRegistry.register(id, styles, true);
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

        const { id, styles } = getStyles<Theme>(styleCollector, theme as Theme);
        registry.register(id, styles, true);

        return () => registry.clear();
    }, [theme, styleCollector]);
}
