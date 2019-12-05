import { useContext, useLayoutEffect } from 'react';

import { STYLE_ID } from './constants';
import { StyleDefinition } from './types';
import { interpolateStyles, isBrowser } from './common';
import { StyleRegistry, ServerStyleRegistry } from './styles';
import { StyleCollector } from './style-collector';
import { SingleStyleCollector } from './css';
import { ThemeContext, ThemeCtx } from './ThemeContext';
import { ServerContext, ServerCtx } from './ServerContext';

function getComponentId<Props, State, Theme>(
    styleDefinition: StyleDefinition<Props, State, Theme>,
    themeCtx: ThemeCtx,
) {
    return `${styleDefinition.name}${styleDefinition.hash}${themeCtx.hash ||
        ''}`;
}

function registerStyle<Props, State, Theme>(
    styleDefinition: StyleDefinition<Props, State, Theme>,
    registry: StyleRegistry | ServerStyleRegistry,
    themeCtx: ThemeCtx,
) {
    const componentId = getComponentId(styleDefinition, themeCtx);
    const className = `.${componentId}`;

    if (!registry.has(className)) {
        const styles = interpolateStyles(
            styleDefinition.styles,
            styleDefinition.expressions,
            themeCtx.theme,
        );

        registry.register(className, styles);
    }
}

export default function useStyles<Props = {}, State = {}, Theme = {}>(
    styleCollector:
        | StyleCollector<Props, State, Theme>
        | SingleStyleCollector<Theme>,
    props?: Props,
    state?: State,
) {
    const themeCtx = useContext<ThemeCtx>(ThemeContext);
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);
    const styleDefinitions = styleCollector
        .get()
        .filter(({ predicate }) => predicate(props, state));

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    if (!isBrowser() && !!serverStyleRegistry) {
        registerStyle(styleCollector.get()[0], serverStyleRegistry, themeCtx);
    }

    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const registry = new StyleRegistry(headElement, STYLE_ID);

        styleDefinitions.forEach(styleDefinition => {
            registerStyle(styleDefinition, registry, themeCtx);
        });
    }, [styleDefinitions, themeCtx]);

    return styleDefinitions
        .reduce((accum, styleDefinition) => {
            return `${accum} ${getComponentId(styleDefinition, themeCtx)}`;
        }, '')
        .trim();
}
