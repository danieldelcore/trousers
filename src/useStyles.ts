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

function registerStyle<Props, State, Theme>(
    styleDefinition: StyleDefinition<Props, State, Theme>,
    elementName: string,
    registry: StyleRegistry | ServerStyleRegistry,
    themeCtx: ThemeCtx,
) {
    const componentId = getComponentId(styleDefinition, elementName, themeCtx);
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
    const elementName = styleCollector.getElementName();

    if (!isBrowser() && !serverStyleRegistry) {
        throw Error(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    }

    if (!isBrowser() && !!serverStyleRegistry) {
        registerStyle(
            styleCollector.get()[0],
            elementName,
            serverStyleRegistry,
            themeCtx,
        );
    }

    useLayoutEffect(() => {
        console.log('useLayoutEffect');

        const headElement = document.getElementsByTagName('head')[0];
        const registry = new StyleRegistry(headElement, STYLE_ID);

        styleCollector
            .get()
            .filter(({ predicate }) => predicate(props, state))
            .forEach(styleDefinition => {
                registerStyle(styleDefinition, elementName, registry, themeCtx);
            });
    }, [props, state, styleCollector, elementName, themeCtx]);

    return styleCollector
        .get()
        .filter(({ predicate }) => predicate(props, state))
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
