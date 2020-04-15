const interpolateStyles = <Theme>(
    styles: TemplateStringsArray | string[],
    expressions: any[],
    theme: Theme,
) =>
    expressions.reduce((result, expression, index) => {
        const value =
            typeof expression === 'function' ? expression(theme) : expression;

        return result + value + styles[index + 1];
    }, styles[0]);

export default interpolateStyles;
