const { createMacro } = require('babel-plugin-macros');
const { parse } = require('@babel/parser');
const { process, themify } = require('@trousers/core');
const hash = require('@trousers/hash').default;

const parseObject = objectExpression =>
    objectExpression.properties.reduce((accum, { key, value }) => {
        accum[key.name || key.value] =
            value.type === 'StringLiteral' ? value.value : parseObject(value);
        return accum;
    }, {});

function macro({ references, babel }) {
    const t = babel.types;
    const namedImport =
        references.default.length && references.default[0].node.name;

    references.default.forEach(reference => {
        const styleBlocks = [];

        reference.find(path => {
            if (!path.isCallExpression()) return;

            if (
                path.node.callee.name === namedImport ||
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
                case namedImport:
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

    return {
        keepImports: true,
    };
}

module.exports = createMacro(macro);
