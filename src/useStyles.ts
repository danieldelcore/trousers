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
    elementName: string,
    themeCtx: ThemeCtx,
) {
    const hash = `${styleDefinition.hash}${themeCtx.hash || ''}`;
    return `${elementName}${styleDefinition.separator}${hash}`;
}

function registerStyles<Props, State, Theme>(
    styleDefinitions: StyleDefinition<Props, State, Theme>[],
    elementName: string,
    registry: StyleRegistry | ServerStyleRegistry,
    themeCtx: ThemeCtx,
) {
    styleDefinitions.forEach(styleDefinition => {
        const componentId = getComponentId(
            styleDefinition,
            elementName,
            themeCtx,
        );
        const className = `.${componentId}`;

        if (!registry.has(className)) {
            const styles = interpolateStyles(
                styleDefinition.styles,
                styleDefinition.expressions,
                themeCtx.theme,
            );

            registry.register(className, styles);
        }
    });
}

export default function useStyles<Props = {}, State = {}, Theme = {}>(
    styleCollector:
        | StyleCollector<Props, State, Theme>
        | SingleStyleCollector<Theme>,
    props?: Props,
    state?: State,
): string {
    const themeCtx = useContext<ThemeCtx>(ThemeContext);
    const serverStyleRegistry = useContext<ServerCtx>(ServerContext);
    const elementName = styleCollector.getElementName();
    const styleDefinitions = styleCollector
        .get()
        .filter(({ predicate }) => predicate(props, state));

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    if (!isBrowser() && !!serverStyleRegistry) {
        registerStyles(
            styleDefinitions,
            elementName,
            serverStyleRegistry,
            themeCtx,
        );
    }

    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const registry = new StyleRegistry(headElement, STYLE_ID);

        registerStyles(styleDefinitions, elementName, registry, themeCtx);
    }, [styleDefinitions, elementName, themeCtx]);

    return styleDefinitions
        .reduce((accum, styleDefinition) => {
            const componentId = getComponentId(
                styleDefinition,
                elementName,
                themeCtx,
            );

            return `${accum} ${componentId}`;
        }, '')
        .trim();
}
