import { useContext, useLayoutEffect } from 'react';
import { STYLE_ID, StyleCollector, CSSProps } from '@trousers/utils';
import { toHash } from '@trousers/hash';
import { useTheme } from '@trousers/theme';
import { ServerContext, ServerCtx } from '@trousers/server';
import { registry } from '@trousers/registry';
import { parseObject } from '@trousers/parser';

import { interpolateStyles, isBrowser } from './common';
import css from './css';

interface ActiveDefinition {
    componentId: string;
    styles: string;
}

function isCollector<Theme>(
    collector: StyleCollector<Theme> | CSSProps,
): collector is StyleCollector<Theme> {
    return !!(collector as StyleCollector<Theme>).get;
}

export default function useStyles<Theme = {}>(
    collector: StyleCollector<Theme> | CSSProps,
) {
    const themeCtx = useTheme();
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);
    const styleDefinitions = isCollector<Theme>(collector)
        ? collector.get()
        : css([parseObject(collector)]).get();
    const activeDefinitions: ActiveDefinition[] = styleDefinitions
        .filter(({ predicate }) => !!predicate)
        .map(definition => {
            const styles = interpolateStyles(
                definition.styles,
                definition.expressions,
                themeCtx.theme,
            );

            const componentId =
                definition.name +
                toHash(styles).toString() +
                themeCtx.hash.toString();

            return {
                styles,
                componentId,
            };
        });

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    if (!isBrowser() && !!serverStyleRegistry) {
        serverStyleRegistry.register(
            `.${activeDefinitions[0].componentId}`,
            activeDefinitions[0].styles,
        );
    }

    const hash = activeDefinitions.reduce(
        (accum, { componentId }) => accum + componentId,
        '',
    );

    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const clientRegistry = registry(headElement, STYLE_ID);

        activeDefinitions.forEach(definition =>
            clientRegistry.register(definition.componentId, definition.styles),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    return activeDefinitions
        .reduce((accum, definition) => `${accum} ${definition.componentId}`, '')
        .trim();
}
