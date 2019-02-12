import { useContext, useMemo } from 'react';

import { StyleCollector } from './trousers';
import { ThemeContext } from './ThemeContext';
// import { registerStyle } from './common';

export default function useTrousers<Props>(
    componentName: string,
    props: Props,
    styleCollector: StyleCollector
) {
    const theme = useContext(ThemeContext);
    const styleDefinition = styleCollector.get();
    // const elementClassName = useMemo(() => renderStyles(styleDefinition[0], props, theme), [styleDefinition[0], props, theme]);
    // const modifierClassNames = styleDefinition
    //     .slice(1)
    //     .reduce((accum: string, modifier) => {
    //         const className = useMemo(() => renderStyles(modifier, props, theme), [modifier, props, theme]);
    //         return `${accum}${className}`;
    //     }, '')
    //     .trim();

    // const classNames = `${componentName}${elementClassName}${modifierClassNames}`

    // return classNames;

    return '';
}
