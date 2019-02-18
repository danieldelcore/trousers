export default function interpolateStyles<Theme>(
  styles: TemplateStringsArray,
  expressions: any[],
  theme: Theme,
): string {
  return expressions
    .reduce((result, expression, index) => {
      const value = typeof expression === 'function'
        ? expression(theme)
        : expression;

      return result + value + styles[index + 1];
    }, styles[0])
}
