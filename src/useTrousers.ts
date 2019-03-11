import { useContext, useEffect } from 'react';
import memoize from 'memoizee';

import { StyleDefinition } from './types';
import { interpolateStyles } from './common';
import createStyleRegistry from './style-registry';
import { ThemeContext, ThemeCtx, StyleCollector } from './';

const styleRegisty = createStyleRegistry('data-trousers');

const mountStyles = memoize(
    <Props, Theme>(
        componentId: string,
        styleDefinition: StyleDefinition<Props, Theme>,
        theme: Theme,
    ): string => {
        const componentSelector = `.${componentId}`;

        if (!styleRegisty.has(componentSelector)) {
            const styles = interpolateStyles(
                styleDefinition.styles,
                styleDefinition.expressions,
                theme,
            );

            styleRegisty.register(componentSelector, styles);
        }

        return componentId;
    },
    { length: 1 },
);

export default function useTrousers<Props, Theme>(
    componentName: string,
    props: Props,
    styleCollector: StyleCollector<Props, Theme>,
): string {
    type CurrentStyle = StyleDefinition<Props, Theme>;

    const styleDefinitions = styleCollector.get();
    const { theme, hash: themeHash } = useContext<ThemeCtx>(ThemeContext);

    useEffect(() => () => mountStyles.clear(), []);

    const elementClassName = styleDefinitions
        .filter(({ type }: CurrentStyle) => type === 'element')
        .reduce((accum: string, styleDefinition: CurrentStyle) => {
            const hash = `${styleDefinition.hash}${themeHash}`;
            const componentId = `${componentName}__${hash}`;

            const className = mountStyles(componentId, styleDefinition, theme as Theme);

            return `${accum}${className} `;
        }, '')
        .trim();

    const modifierClassNames = styleDefinitions
        .filter(({ type }: CurrentStyle) => type === 'modifier')
        .filter(({ predicate }: CurrentStyle) => predicate && predicate(props))
        .reduce((accum: string, styleDefinition: CurrentStyle) => {
            const hash = `${styleDefinition.hash}${themeHash}`;
            const componentId = `${componentName}--${hash}`;

            const className = mountStyles(componentId, styleDefinition, theme as Theme);

            return `${accum}${className} `;
        }, '')
        .trim();

    return `${elementClassName} ${modifierClassNames}`;
}
