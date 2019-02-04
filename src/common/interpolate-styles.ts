function interpolateStyles(
  styles: TemplateStringsArray,
  expressions: any[],
  theme: Record<string, any>,
): string {
  return expressions.reduce((result, expression, index) => {
    const value = typeof expression === 'function'
      ? expression(theme)
      : expression;

    return result + value + styles[index + 1];
  }, styles[0]);
}

export default interpolateStyles;
