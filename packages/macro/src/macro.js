const { createMacro } = require('babel-plugin-macros');
const { parse } = require('@babel/parser');
const { process, themify } = require('@trousers/core');
const hash = require('@trousers/hash').default;

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
            ['Identifier', 'BinaryExpression', 'CallExpression'].includes(
                value.type,
            )
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

    let interpolationsCount = 0;

    references.css.forEach(reference => {
        const interpolations = [];
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
                    const id = `--interpol${interpolationsCount++}`;
                    interpolations.push({ reference, id, interpolation });
                    return `var(${id})`;
                },
            );
            const hashedStyles = hash(JSON.stringify(rawStyleBlock));

            let id = args.length === 2 ? args[0].value : '';
            let className = '';
            let processedStyles;

            switch (type) {
                case importName:
                    elementId = id;
                    className = `.${id && id + '-'}${hashedStyles}`;
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

        // Dynamic interpolations
        let jsxOpeningElements = [];
        const parentJsxElement = reference.find(path =>
            path.isJSXOpeningElement(),
        );
        if (parentJsxElement) jsxOpeningElements.push(parentJsxElement);

        if (!jsxOpeningElements.length) {
            const styleVariable = reference.findParent(
                path => path.type === 'VariableDeclarator',
            );
            const styleVariableId = styleVariable && styleVariable.node.id.name;

            program.traverse({
                JSXOpeningElement: path => {
                    const cssAttr = path.node.attributes.find(
                        attr =>
                            attr.name.name === 'css' &&
                            attr.value.expression.name === styleVariableId,
                    );
                    if (!cssAttr) return;

                    jsxOpeningElements.push(path);
                },
            });
        }

        jsxOpeningElements.forEach(jsxOpeningElement => {
            const stylesAttr = jsxOpeningElement.node.attributes.find(
                attr => attr.name.name === 'styles',
            );

            const styleProperties = stylesAttr
                ? stylesAttr.value.expression.properties
                : [];

            // ERROR: This code runs over opening elements multiple times....
            // need to refactor this whole damn thing
            jsxOpeningElement.replaceWith(
                t.jsxOpeningElement(
                    t.jsxIdentifier('TrousersNested'),
                    [
                        ...jsxOpeningElement.node.attributes.filter(
                            attr => attr.name.name !== 'styles',
                        ),
                        t.jsxAttribute(
                            t.jsxIdentifier('elementType'),
                            t.stringLiteral(jsxOpeningElement.node.name.name),
                        ),
                        t.jsxAttribute(
                            t.jsxIdentifier('styles'),
                            t.jsxExpressionContainer(
                                t.objectExpression([
                                    ...styleProperties,
                                    ...interpolations.map(
                                        ({ id, interpolation }) =>
                                            t.objectProperty(
                                                t.stringLiteral(id),
                                                interpolation,
                                            ),
                                    ),
                                ]),
                            ),
                        ),
                    ],
                    jsxOpeningElement.node.selfClosing,
                ),
            );
        });
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
                    t.identifier('TrousersNested'),
                    t.identifier('TrousersNested'),
                ),
            ],
            t.stringLiteral('@trousers/macro/runtime'),
        ),
    );

    return {
        keepImports: false,
    };
}

module.exports = createMacro(macro);
