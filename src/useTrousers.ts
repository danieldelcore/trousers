import { useContext } from 'react';

import { StyleDefinition } from './types';
import { interpolateStyles, isBrowser } from './common';
import { StyleRegistry } from './styles';
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

export default function useTrousers<Props, State, Theme>(
    styleCollector:
        | StyleCollector<Props, State, Theme>
        | SingleStyleCollector<Theme>,
    props?: Props,
    state?: State,
): string {
    type CurrentStyle = StyleDefinition<Props, State, Theme>;

    const { theme, hash: themeHash } = useContext<ThemeCtx>(ThemeContext);
    const { serverStyleRegistry } = useContext<ServerCtx>(ServerContext);

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
            const className = `.${componentId}`;

            if (!registry.has(className)) {
                const styles = interpolateStyles(
                    styleDefinition.styles,
                    styleDefinition.expressions,
                    theme,
                );

                registry.register(className, styles);
            }

            return `${accum} ${componentId}`;
        }, '')
        .trim();
}
