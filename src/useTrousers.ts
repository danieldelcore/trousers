import { useContext } from 'react';

import { StyleCollector, StyleDefinition } from './trousers';
import { ThemeContext } from './ThemeContext';
import { renderStyles, generateHash } from './common';

function mountStyles<Props>(
    componentName: string,
    styleDefinition: StyleDefinition<Props>,
    theme: Record<string, any>,
    separator: string = '--'
): string {
    const className = `${componentName}${separator}${generateHash()}`

    renderStyles(`.${className}`, styleDefinition, theme);

    return className;
}

export default function useTrousers<Props>(
    componentName: string,
    props: Props,
    styleCollector: StyleCollector<Props>
): string {
    const { theme } = useContext(ThemeContext);
    const styleDefinition = styleCollector.get();

    const elementClassName = mountStyles(componentName, styleDefinition[0], theme);

    const modifierClassNames = styleDefinition
        .slice(1)
        .filter((modifier: StyleDefinition<Props>) => modifier.predicate && modifier.predicate(props))
        .reduce((accum: string, modifier: StyleDefinition<Props>) => {
            const modifierClassName = mountStyles(componentName, modifier, theme, '__');

            return `${accum}${modifierClassName} `;
        }, '')
        .trim();

    return `${elementClassName} ${modifierClassNames}`;
}
