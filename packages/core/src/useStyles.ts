import { useContext, useLayoutEffect, useMemo } from 'react';
import {
    STYLE_ID,
    StyleDefinition,
    StyleCollector,
    CSSProps,
} from '@trousers/utils';
import { useTheme, ThemeCtx } from '@trousers/theme';
import { ServerContext, ServerCtx } from '@trousers/server';
import { registry, Registry } from '@trousers/registry';
import { parseObject } from '@trousers/parser';

import { interpolateStyles, isBrowser } from './common';
import css from './css';

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
    collector: StyleCollector<Theme> | CSSProps,
) {
    const themeCtx = useTheme();
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);
    const styleCollector = !(collector as StyleCollector<Theme>).get
        ? css([parseObject(collector as CSSProps)])
        : (collector as StyleCollector<Theme>);

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    if (!isBrowser() && !!serverStyleRegistry) {
        registerStyle(serverStyleRegistry, styleCollector.get()[0], themeCtx);
    }

    const styleDefinitions = useMemo(
        () => styleCollector.get().filter(({ predicate }) => !!predicate),
        [styleCollector],
    );

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
