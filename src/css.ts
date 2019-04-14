import { StyleCollector } from './';
import { Expression } from './types';

export default function css<Theme>(
    styles: TemplateStringsArray,
    ...expressions: Expression<Theme>[]
) {
    const styleCollector = new StyleCollector<{}, {}, Theme>('css');

    styleCollector.element(styles, ...expressions);

    return styleCollector;
}
