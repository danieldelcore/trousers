import { StyleCollector } from './';
import { Expression, StyleDefinition } from './types';

export interface SingleStyleCollector<Theme> {
    get: () => StyleDefinition<{}, {}, Theme>[];
}

export default function css<Theme = {}>(
    styles: TemplateStringsArray,
    ...expressions: Expression<Theme>[]
): SingleStyleCollector<Theme> {
    const styleCollector = new StyleCollector<{}, {}, Theme>('css');

    styleCollector.element(styles, ...expressions);

    return {
        get: () => styleCollector.get(),
    };
}
