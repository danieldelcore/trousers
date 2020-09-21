import {
    createElement,
    hasOwnProperty,
    ElementType,
    ReactNode,
    useLayoutEffect,
} from 'react';

import { StyleCollector, CSSProps } from '@trousers/utils';
import { registry, Registry } from '@trousers/registry';
import { parseObject } from '@trousers/parser';
import { useTheme } from '@trousers/theme';
import { toHash } from '@trousers/hash';
import './types';
import css from './css';
import { interpolateStyles } from './common';

interface ActiveDefinition {
    componentId: string;
    styles: string;
}
function isCollector<Theme>(
    collector: StyleCollector<Theme> | CSSProps,
): collector is StyleCollector<Theme> {
    return !!(collector as StyleCollector<Theme>).get;
}

function getComponentId(
    name: string,
    stylesHash: string,
    themeHash: string = '',
) {
    return `${name}${stylesHash}${themeHash}`;
}

function registerStyle(registry: Registry, definition: ActiveDefinition) {
    const className = `.${definition.componentId}`;
    if (registry.has(className)) return;
    registry.register(className, definition.styles);
}

const jsx = <
    Props extends { css: StyleCollector<Theme> | CSSProps },
    Theme extends {} = {}
>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css')) {
        return createElement(type, props, ...children);
    }

    const { css: collector, ...rest } = props;
    // @ts-ignore
    console.log(collector.get && collector.get());

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const themeCtx = useTheme();
    const styleDefinitions = isCollector<Theme>(collector)
        ? collector.get()
        : css([parseObject(css)]).get();

    let hashedExpressions: any[] = [];

    const activeDefinitions: ActiveDefinition[] = styleDefinitions
        .filter(({ predicate }: any) => !!predicate)
        .map(definition => {
            hashedExpressions = definition.expressions.reduce(
                (accum, expression) => {
                    accum.push({
                        // @ts-ignore
                        hash: `--trousers-${hashedExpressions.length}`,
                        // @ts-ignore
                        expression,
                    });

                    return accum;
                },
                [],
            );

            const styles = interpolateStyles(
                definition.styles,
                hashedExpressions.reduce((accum, { hash }) => {
                    accum.push(`var(${hash})`);
                    return accum;
                }, []),
                themeCtx.theme,
            );

            const componentId = getComponentId(
                definition.name,
                toHash(styles).toString(),
                themeCtx.hash.toString(),
            );

            return {
                styles,
                componentId,
            };
        });

    const hash = activeDefinitions.reduce(
        (accum, { componentId }) => accum + componentId,
        '',
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
        const headElement = document.getElementsByTagName('head')[0];
        const clientRegistry = registry(headElement, 'data-trousers');

        activeDefinitions.forEach(definition =>
            registerStyle(clientRegistry, definition),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    // // eslint-disable-next-line react-hooks/rules-of-hooks
    const className = activeDefinitions
        .reduce((accum, definition) => `${accum} ${definition.componentId}`, '')
        .trim();

    const style = {
        ...hashedExpressions.reduce((accum, { hash, expression }) => {
            if (typeof expression === 'function') {
                accum[hash] = expression(); // todo pass theme here
            } else {
                accum[hash] = expression;
            }
            return accum;
        }, {}),
        // @ts-ignore
        ...(rest.style || {}),
    };

    return createElement(type, { ...rest, className, style }, ...children);
};

export default jsx;
export { CSSProps };
