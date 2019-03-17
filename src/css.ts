import { Expression, TaggedTemplate } from './types';

export class SingleStyleCollector<Theme> {
    private taggedTemplate?: TaggedTemplate<Theme>;

    get(): TaggedTemplate<Theme> {
        return this.taggedTemplate!;
    }

    registerStyles(
        styles: TemplateStringsArray,
        expressions: Expression<Theme>[],
    ) {
        this.taggedTemplate = {
            styles,
            expressions,
        };

        return this;
    }
}

export default function css<Theme>(
    styles: TemplateStringsArray,
    ...expressions: Expression<Theme>[]
) {
    const styleCollector = new SingleStyleCollector<Theme>();

    styleCollector.registerStyles(styles, expressions);

    return styleCollector;
}
