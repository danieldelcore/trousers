const { createMacro } = require('babel-plugin-macros');
const { parse } = require('@babel/parser');
const { process, themify } = require('@trousers/core');
const hash = require('@trousers/hash').default;

const libraryMeta = {
    runtimeComponent: 'TrousersNested',
    runtimeModulePath: '@trousers/macro/runtime',
};

const findJsxAttribute = (path, attributeName) =>
    path.node.attributes.find(attr => attr.name.name === attributeName);

const parseObject = (objectExpression, onInterpolation = () => {}) =>
    objectExpression.properties.reduce((accum, { key, value }) => {
        let parsedValue;

        // Raw values
        if (
            ['StringLiteral', 'NumericLiteral', 'BooleanLiteral'].includes(
                value.type,
            )
        ) {
            parsedValue = value.value;
        }

        // Variable & function interpolations
        if (
            [
                'Identifier',
                'MemberExpression',
                'BinaryExpression',
                'CallExpression',
            ].includes(value.type)
        ) {
            parsedValue = onInterpolation(value);
        }

        // Object interpolations
        if (value.type === 'ObjectExpression') {
            parsedValue = parseObject(value, onInterpolation);
        }

        accum[key.name || key.value] = parsedValue;

        return accum;
    }, {});

function macro({ references, babel }) {
    const t = babel.types;

    if (references.css.length === 0) return;

    const program = references.css[0].findParent(path => path.isProgram());
    const interpolations = [];

    references.css.forEach((reference, index) => {
        const styleBlocks = [];
        const importName = reference.node.name;

        reference.find(path => {
            if (!path.isCallExpression()) return;

            if (
                path.node.callee.name === importName ||
                ['modifier', 'theme', 'global'].includes(
                    path.node.callee.property.name,
                )
            ) {
                styleBlocks.push(path);
            }
        });

        let elementId = '';

        styleBlocks.forEach(styleBlock => {
            const { arguments: args, callee } = styleBlock.node;
            const objectExpression = args.length === 2 ? args[1] : args[0];
            const type = callee.name || callee.property.name;
            const rawStyleBlock = parseObject(
                objectExpression,
                interpolation => {
                    const id = `--interpol${interpolations.length}`;
                    interpolations.push({
                        referenceIndex: index,
                        id,
                        value: interpolation,
                    });
                    return `var(${id})`;
                },
            );
            const hashedStyles = hash(JSON.stringify(rawStyleBlock));

            let id = args.length === 2 ? args[0].value : '';
            let className = '';
            let processedStyles;

            switch (type) {
                case importName:
                    elementId = `${id && id + '-'}${hashedStyles}`;
                    className = `.${elementId}`;
                    processedStyles = process(className, rawStyleBlock);
                    break;
                case 'modifier':
                    className = `.${elementId}--${args[0].value}-${hashedStyles}`;
                    processedStyles = process(className, rawStyleBlock);
                    break;
                case 'global':
                    id = `global-${elementId}-${hashedStyles}`;
                    processedStyles = process(className, rawStyleBlock);
                    break;
                case 'theme':
                    className = `.theme-${elementId}-${hashedStyles}`;
                    processedStyles = process(
                        className,
                        themify(rawStyleBlock),
                    );
                    break;
                default:
                    break;
            }

            const parsedStyles = parse(`(${JSON.stringify(processedStyles)})`);

            styleBlock.replaceWith(
                t.callExpression(callee, [
                    t.stringLiteral(id),
                    parsedStyles.program.body[0].expression,
                ]),
            );
        });
    });

    program.traverse({
        JSXOpeningElement: path => {
            const cssAttr = findJsxAttribute(path, 'css');
            if (!cssAttr) return;

            const cssPropExpression = cssAttr.value.expression;
            const stylesAttr = findJsxAttribute(path, 'styles');
            const styleProperties = stylesAttr
                ? stylesAttr.value.expression.properties
                : [];

            const interpolationProperties = interpolations
                .filter(({ referenceIndex }) => {
                    let matchedReferenceIndex = -1;
                    references.css.forEach((referencePath, i) => {
                        // collector passed directly into css prop
                        if (
                            cssPropExpression.callee &&
                            cssPropExpression.callee.name ===
                                referencePath.node.name &&
                            cssPropExpression.callee.start ===
                                referencePath.node.start
                        ) {
                            matchedReferenceIndex = i;
                        }

                        // collector variable passed into css prop
                        const variableDeclarator = referencePath.find(p =>
                            p.isVariableDeclarator(),
                        );

                        if (
                            variableDeclarator.node.id.name ===
                            cssPropExpression.name
                        ) {
                            matchedReferenceIndex = i;
                        }
                    });

                    return referenceIndex === matchedReferenceIndex;
                })
                .map(({ id, value }) =>
                    t.objectProperty(t.stringLiteral(id), value),
                );

            const TrousersNestedProps = [
                ...path.node.attributes.filter(
                    attr => attr.name.name !== 'styles',
                ),
                t.jsxAttribute(
                    t.jsxIdentifier('elementType'),
                    t.stringLiteral(path.node.name.name),
                ),
            ];

            const styleObjectProperties = [
                ...styleProperties,
                ...interpolationProperties,
            ];

            if (styleObjectProperties.length) {
                TrousersNestedProps.push(
                    t.jsxAttribute(
                        t.jsxIdentifier('style'),
                        t.jsxExpressionContainer(
                            t.objectExpression(styleObjectProperties),
                        ),
                    ),
                );
            }

            path.replaceWith(
                t.jsxOpeningElement(
                    t.jsxIdentifier(libraryMeta.runtimeComponent),
                    TrousersNestedProps,
                    path.node.selfClosing,
                ),
            );

            path.skip();
        },
    });

    // Import manipulation
    const importName = references.css[0].node.name;

    program.node.body.unshift(
        t.importDeclaration(
            [
                t.importSpecifier(
                    t.identifier(importName),
                    t.identifier(importName),
                ),
                t.importSpecifier(
                    t.identifier(libraryMeta.runtimeComponent),
                    t.identifier(libraryMeta.runtimeComponent),
                ),
            ],
            t.stringLiteral(libraryMeta.runtimeModulePath),
        ),
    );

    return {
        keepImports: false,
    };
}

module.exports = createMacro(macro);
