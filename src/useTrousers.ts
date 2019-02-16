import { useContext } from 'react';
import memoize from 'fast-memoize';

import { StyleCollector, StyleDefinition } from './trousers';
import { ThemeContext } from './ThemeContext';
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

export default function useTrousers<Props>(
    componentName: string,
    props: Props,
    styleCollector: StyleCollector<Props>
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
        .filter((modifier: StyleDefinition<Props>) => modifier.predicate && modifier.predicate(props))
        .reduce((accum: string, modifier: StyleDefinition<Props>) => {
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
