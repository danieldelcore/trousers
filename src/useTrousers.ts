import { useContext, useEffect } from 'react';
import memoize from 'memoizee';

import { StyleDefinition } from './types';
import { interpolateStyles, isBrowser } from './common';
import { StyleRegistry, ServerStyleRegistry } from './styles';
import {
    ThemeContext,
    ThemeCtx,
    StyleCollector,
    ServerContext,
    ServerCtx,
} from './';

let styleRegisty: StyleRegistry;

if (isBrowser()) {
    const headElement = document.getElementsByTagName('head')[0];
    styleRegisty = new StyleRegistry(headElement, 'data-trousers');
}

const mountStyles = memoize(
    <Props, Theme>(
        componentId: string,
        styleDefinition: StyleDefinition<Props, Theme>,
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

export default function useTrousers<Props, Theme>(
    props: Props,
    styleCollector: StyleCollector<Props, Theme>,
): string {
    type CurrentStyle = StyleDefinition<Props, Theme>;

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

    const elementClassName = styleCollector
        .get('element')
        .reduce((accum: string, styleDefinition: CurrentStyle) => {
            const hash = `${styleDefinition.hash}${themeHash}`;
            const componentId = `${elementName}__${hash}`;

            const className = mountStyles(
                componentId,
                styleDefinition,
                theme as Theme,
                registry,
            );

            return `${accum}${className} `;
        }, '')
        .trim();

    const modifierClassNames = styleCollector
        .get('modifier')
        .filter(({ predicate }: CurrentStyle) => predicate && predicate(props))
        .reduce((accum: string, styleDefinition: CurrentStyle) => {
            const hash = `${styleDefinition.hash}${themeHash}`;
            const componentId = `${elementName}--${hash}`;

            const className = mountStyles(
                componentId,
                styleDefinition,
                theme as Theme,
                registry,
            );

            return `${accum}${className} `;
        }, '')
        .trim();

    return `${elementClassName} ${modifierClassNames}`;
}
