const { createMacro } = require('babel-plugin-macros');
const { parse } = require('@babel/parser');
const { process, themify } = require('@trousers/core');
const hash = require('@trousers/hash').default;

const parseObject = objectExpression =>
    objectExpression.properties.reduce((accum, { key, value }) => {
        let parsedValue;

        if (
            value.type === 'StringLiteral' ||
            value.type === 'NumericLiteral' ||
            value.type === 'BooleanLiteral'
        ) {
            parsedValue = value.value;
        } else {
            parsedValue = parseObject(value);
        }

        accum[key.name || key.value] = parsedValue;

        return accum;
    }, {});

function macro({ references, babel }) {
    const t = babel.types;

    if (references.css.length === 0) return;

    references.css.forEach(reference => {
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
            const { arguments, callee } = styleBlock.node;
            const objectExpression =
                arguments.length === 2 ? arguments[1] : arguments[0];
            const type = callee.name || callee.property.name;
            const rawStyleBlock = parseObject(objectExpression);
            const hashedStyles = hash(JSON.stringify(rawStyleBlock));

            let id = arguments.length === 2 ? arguments[0].value : '';
            let className = '';
            let processedStyles;

            switch (type) {
                case importName:
                    elementId = id;
                    className = `.${id && id + '-'}${hashedStyles}`;
                    processedStyles = process(className, rawStyleBlock);
                    break;
                case 'modifier':
                    className = `.${elementId}--${arguments[0].value}-${hashedStyles}`;
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

    const importName = references.css[0].node.name;

    const { body } = references.css[0].findParent(path =>
        path.isProgram(),
    ).node;

    body.unshift(
        t.importDeclaration(
            [
                t.importSpecifier(
                    t.identifier(importName),
                    t.identifier(importName),
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
