import { useContext, useLayoutEffect, useMemo } from 'react';

import { STYLE_ID } from './constants';
import { StyleDefinition, StyleCollector } from './types';
import { interpolateStyles, isBrowser } from './common';
import { registry, Registry } from './registry';
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
    registry: Registry,
    styleDefinition: StyleDefinition<Theme>,
    themeCtx: ThemeCtx,
) {
    const componentId = getComponentId(styleDefinition, themeCtx);
    const className = `.${componentId}`;

    if (registry.has(className)) return;

    registry.register(
        className,
        interpolateStyles(
            styleDefinition.styles,
            styleDefinition.expressions,
            themeCtx.theme,
        ),
    );
}

export default function useStyles<Theme = {}>(
    styleCollector: StyleCollector<Theme>,
) {
    const themeCtx = useContext<ThemeCtx>(ThemeContext);
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);

    const styleDefinitions = useMemo(
        () => styleCollector.get().filter(({ predicate }) => !!predicate),
        [styleCollector],
    );

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    if (!isBrowser() && !!serverStyleRegistry) {
        registerStyle(serverStyleRegistry, styleCollector.get()[0], themeCtx);
    }

    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const clientRegistry = registry(headElement, STYLE_ID);

        styleDefinitions.forEach(styleDefinition =>
            registerStyle(clientRegistry, styleDefinition, themeCtx),
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
