import { useContext, useLayoutEffect, useMemo } from 'react';

import { STYLE_ID } from './constants';
import { StyleDefinition } from './types';
import { interpolateStyles, isBrowser } from './common';
import { Registry, ServerRegistry } from './registry';
import { StyleCollector } from './style-collector';
import { SingleStyleCollector } from './css';
import { ThemeContext, ThemeCtx } from './ThemeContext';
import { ServerContext, ServerCtx } from './ServerContext';

function getComponentId<Theme>(
    styleDefinition: StyleDefinition<Theme>,
    themeCtx: ThemeCtx,
) {
    return `${styleDefinition.name}${styleDefinition.hash}${themeCtx.hash ||
        ''}`;
}

function registerStyle<Theme>(
    styleDefinition: StyleDefinition<Theme>,
    registry: Registry | ServerRegistry,
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

export default function useStyles<Theme = {}>(
    styleCollector: StyleCollector<Theme> | SingleStyleCollector<Theme>,
) {
    const themeCtx = useContext<ThemeCtx>(ThemeContext);
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);

    const styleDefinitions = useMemo(() => {
        return styleCollector.get().filter(({ predicate }) => !!predicate);
    }, [styleCollector]);

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
        const registry = new Registry(headElement, STYLE_ID);

        styleDefinitions.forEach(styleDefinition =>
            registerStyle(styleDefinition, registry, themeCtx),
        );
    }, [styleDefinitions, themeCtx]);

    return styleDefinitions
        .reduce(
            (accum, styleDefinition) =>
                `${accum} ${getComponentId(styleDefinition, themeCtx)}`,
            '',
        )
        .trim();
}
