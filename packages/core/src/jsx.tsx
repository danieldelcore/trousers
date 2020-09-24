import {
    createElement,
    hasOwnProperty,
    ElementType,
    ReactNode,
    useLayoutEffect,
    useMemo,
} from 'react';
import { StyleCollector, CSSProps } from '@trousers/utils';
import { registry } from '@trousers/registry';
import { parseObject } from '@trousers/parser';
import { useTheme } from '@trousers/theme';
import { toHash } from '@trousers/hash';

import css from './css';

type DynamicExpressions = Record<string, any>;

interface ActiveDefinition {
    componentId: string;
    styles: string;
    dynamicExpressions: DynamicExpressions;
}

function isCollector<Theme>(
    collector: StyleCollector<Theme> | CSSProps,
): collector is StyleCollector<Theme> {
    return !!(collector as StyleCollector<Theme>).get;
}

const interpolateStyles = (
    styles: TemplateStringsArray | string[],
    expressions: string[],
) =>
    expressions.reduce(
        (result, expression, index) =>
            `${result}var(${expression})${styles[index + 1]}`,
        styles[0],
    );

const jsx = <
    Props extends { css: StyleCollector<Theme> | CSSProps; [key: string]: any },
    Theme extends {} = {}
>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css')) {
        return createElement(type, props, ...children);
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const themeCtx = useTheme();

    const { css: collector, ...rest } = props;
    const styleDefinitions = (isCollector<Theme>(collector)
        ? collector
        : css([parseObject(css)])
    ).get();

    const activeDefinitions: ActiveDefinition[] = styleDefinitions
        .filter(({ predicate }) => !!predicate)
        .map((definition, i) => {
            const dynamicExpressions = definition.expressions.reduce<
                DynamicExpressions
            >((accum, expression, j) => {
                accum[`--trousers-${i}-${j}`] = expression;
                return accum;
            }, {});

            const styles = interpolateStyles(
                definition.styles,
                Object.keys(dynamicExpressions),
            );

            const componentId =
                definition.name +
                toHash(styles).toString() +
                themeCtx.hash.toString();

            return {
                styles,
                componentId,
                dynamicExpressions,
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
            clientRegistry.register(
                `.${definition.componentId}`,
                definition.styles,
            ),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const style = useMemo(
        () =>
            activeDefinitions.reduce<CSSProps>(
                (accum, { dynamicExpressions }) => {
                    Object.keys(dynamicExpressions).forEach(key => {
                        const expression = dynamicExpressions[key];
                        // @ts-ignore
                        accum[key] =
                            typeof expression === 'function'
                                ? expression(themeCtx.theme as Theme)
                                : expression;
                    });

                    return accum;
                },
                {},
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [hash],
    );

    const className = activeDefinitions
        .map(definition => definition.componentId)
        .join(' ')
        .trim();

    return createElement(type, { ...rest, className, style }, ...children);
};

export default jsx;
export { CSSProps };
