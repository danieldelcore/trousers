import { useContext } from 'react';
import memoize from 'fast-memoize';

import { StyleDefinition } from './types';
import { ThemeContext, StyleCollector } from './';
import { renderStyles, generateHash, interpolateStyles } from './common';

const mountStyles = memoize((
    componentName: string,
    styles: string,
    separator: string = '--'
): string => {
    const className = `${componentName}${separator}${generateHash()}`

    renderStyles(`.${className}`, styles);

    return className;
});

export default function useTrousers<Props, Theme>(
    componentName: string,
    props: Props,
    styleCollector: StyleCollector<Props, Theme>
): string {
    const { theme } = useContext(ThemeContext);
    const styleDefinition = styleCollector.get();

    const elementStyles = interpolateStyles(
        styleDefinition[0].styles,
        styleDefinition[0].expressions,
        theme
    );

    const elementClassName = mountStyles(componentName, elementStyles);

    const modifierClassNames = styleDefinition
        .slice(1)
        .filter((modifier: StyleDefinition<Props, Theme>) => modifier.predicate && modifier.predicate(props))
        .reduce((accum: string, modifier: StyleDefinition<Props, Theme>) => {
            const modifierStyles = interpolateStyles(
                modifier.styles,
                modifier.expressions,
                theme
            );

            const modifierClassName = mountStyles(componentName, modifierStyles, '__');

            return `${accum}${modifierClassName} `;
        }, '')
        .trim();

    return `${elementClassName} ${modifierClassNames}`;
}
