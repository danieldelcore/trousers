import { useContext, useEffect } from 'react';

import {
    SingleStyleCollector,
    ThemeContext,
    ThemeCtx,
    ServerContext,
    ServerCtx,
} from './';
import { interpolateStyles, isBrowser } from './common';
import { StyleRegistry, ServerStyleRegistry } from './styles';

export default function useGlobal<Theme>(
    styleCollector: SingleStyleCollector<Theme>,
) {
    const { theme } = useContext<ThemeCtx>(ThemeContext);
    const { serverStyleRegistry } = useContext<ServerCtx>(ServerContext);

    let registry: StyleRegistry | ServerStyleRegistry;

    function clear() {
        registry.clear();
    }

    useEffect(() => {
        if (isBrowser()) {
            const headElement = document.getElementsByTagName('head')[0];

            registry = new StyleRegistry(headElement, 'data-trousers-global');
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

        registry.register(styleDefinition.hash.toString(), styles);

        return () => clear();
    }, []);

    return [clear];
}
