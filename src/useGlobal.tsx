import { useContext } from 'react';

import { SingleStyleCollector } from './';
import { GLOBAL_STYLE_ID, STYLE_ID } from './constants';
import { interpolateStyles, isBrowser } from './common';
import { StyleRegistry, ServerStyleRegistry } from './styles';
import { ThemeContext, ThemeCtx, ServerContext, ServerCtx } from './';

export default function useGlobal<Theme>(
    styleCollector: SingleStyleCollector<Theme>,
) {
    const { theme } = useContext<ThemeCtx>(ThemeContext);
    const { serverStyleRegistry } = useContext<ServerCtx>(ServerContext);

    let registry: StyleRegistry | ServerStyleRegistry;

    if (isBrowser()) {
        const headElement = document.getElementsByTagName('head')[0];

        registry = new StyleRegistry(headElement, GLOBAL_STYLE_ID, {
            forceNewNode: true,
            appendBefore: STYLE_ID,
        });
    } else if (!isBrowser() && !!serverStyleRegistry) {
        registry = serverStyleRegistry;
    } else {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    const styleDefinition = styleCollector.get()[0];
    const styles = interpolateStyles(
        styleDefinition.styles,
        styleDefinition.expressions,
        theme,
    );

    registry.register(styleDefinition.hash.toString(), styles, true);

    return () => registry.clear();
}
