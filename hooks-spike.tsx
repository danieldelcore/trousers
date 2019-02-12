import { useContext, useMemo } from 'react';

import { ThemeContext, renderStyles } from './src';

export default function useTrousers<Props>(componentName: string, props: Props, styles: any) {
    const theme = useContext(ThemeContext);
    const elementClassName = useMemo(() => renderStyles(styles.element, props, theme), [styles.element, props, theme]);
    const modifierClassNames = styles.modifiers
        .reduce((accum, modifier) => {
            const className = useMemo(() => renderStyles(modifier, props, theme), [modifier, props, theme]);
            return `${accum}${className}`;
        }, '')
        .trim();

    const classNames = `${componentName}${elementClassName}${modifierClassNames}`

    return classNames;
}
