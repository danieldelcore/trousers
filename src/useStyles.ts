import { useContext } from 'react';

import { StyleDefinition } from './types';
import { STYLE_ID } from './constants';
import { interpolateStyles, isBrowser } from './common';
import { StyleRegistry, ServerStyleRegistry } from './styles';
import {
    ThemeContext,
    ThemeCtx,
    StyleCollector,
    SingleStyleCollector,
    ServerContext,
    ServerCtx,
} from './';

export default function useStyles<Props, State, Theme>(
    styleCollector:
        | StyleCollector<Props, State, Theme>
        | SingleStyleCollector<Theme>,
    props?: Props,
    state?: State,
): string {
    type CurrentStyle = StyleDefinition<Props, State, Theme>;

    let registry: StyleRegistry | ServerStyleRegistry;

    const { theme, hash: themeHash } = useContext<ThemeCtx>(ThemeContext);
    const { serverStyleRegistry } = useContext<ServerCtx>(ServerContext);
    const elementName = styleCollector.getElementName();

    if (isBrowser()) {
        const headElement = document.getElementsByTagName('head')[0];

        registry = new StyleRegistry(headElement, STYLE_ID);
    } else if (!isBrowser() && !!serverStyleRegistry) {
        registry = serverStyleRegistry;
    } else {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    return styleCollector
        .get()
        .filter(({ predicate }: CurrentStyle) => predicate(props, state))
        .reduce((accum: string, styleDefinition: CurrentStyle) => {
            const hash = `${styleDefinition.hash}${themeHash}`;
            const componentId = `${elementName}${
                styleDefinition.separator
            }${hash}`;
            const className = `.${componentId}`;

            if (
                !styleCollector.isMounted(className) &&
                !registry.has(className)
            ) {
                const styles = interpolateStyles(
                    styleDefinition.styles,
                    styleDefinition.expressions,
                    theme,
                );

                registry.register(className, styles);
                styleCollector.pushMounted(className);
            }

            return `${accum} ${componentId}`;
        }, '')
        .trim();
}
