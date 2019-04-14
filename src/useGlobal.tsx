import { useContext } from 'react';

import { StyleCollector } from './';
import { interpolateStyles, isBrowser } from './common';
import { StyleRegistry, ServerStyleRegistry } from './styles';
import { ThemeContext, ThemeCtx, ServerContext, ServerCtx } from './';

export default function useGlobal<Theme>(
    styleCollector: StyleCollector<{}, {}, Theme>,
) {
    const { theme } = useContext<ThemeCtx>(ThemeContext);
    const { serverStyleRegistry } = useContext<ServerCtx>(ServerContext);

    let registry: StyleRegistry | ServerStyleRegistry;

    if (isBrowser()) {
        const headElement = document.getElementsByTagName('head')[0];

        registry = new StyleRegistry(headElement, 'data-trousers');
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

    registry.registerGlobal(styles);

    function clear() {
        registry.clear(true);
    }

    return [clear];
}
