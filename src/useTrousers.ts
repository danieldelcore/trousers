import { useContext, useEffect } from 'react';
import memoize from 'memoizee';

import { StyleDefinition } from './types';
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

let styleRegisty: StyleRegistry;

if (isBrowser()) {
    const headElement = document.getElementsByTagName('head')[0];
    styleRegisty = new StyleRegistry(headElement, 'data-trousers');
}

const mountStyles = memoize(
    <Props, State, Theme>(
        componentId: string,
        styleDefinition: StyleDefinition<Props, State, Theme>,
        theme: Theme,
        registry: StyleRegistry | ServerStyleRegistry,
    ): string => {
        const componentSelector = `.${componentId}`;

        if (!registry.has(componentSelector)) {
            const styles = interpolateStyles(
                styleDefinition.styles,
                styleDefinition.expressions,
                theme,
            );

            registry.register(componentSelector, styles);
        }

        return componentId;
    },
    { length: 1 },
);

export default function useTrousers<Props, State, Theme>(
    styleCollector: StyleCollector<Props, State, Theme> | SingleStyleCollector<Theme>,
    props?: Props,
    state?: State,
): string {
    type CurrentStyle = StyleDefinition<Props, State, Theme>;

    const { theme, hash: themeHash } = useContext<ThemeCtx>(ThemeContext);
    const { serverStyleRegistry } = useContext<ServerCtx>(ServerContext);

    useEffect(() => () => mountStyles.clear(), []);

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    const registry = !serverStyleRegistry ? styleRegisty : serverStyleRegistry;
    const elementName = styleCollector.getElementName();

    return styleCollector
        .get()
        .filter(({ predicate }: CurrentStyle) => predicate(props, state))
        .reduce((accum: string, styleDefinition: CurrentStyle) => {
            const hash = `${styleDefinition.hash}${themeHash}`;
            const componentId = `${elementName}${
                styleDefinition.separator
            }${hash}`;

            const className = mountStyles(
                componentId,
                styleDefinition,
                theme as Theme,
                registry,
            );

            return `${accum}${className} `;
        }, '')
        .trim();
}
