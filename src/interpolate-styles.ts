function interpolateStyles<P>(
  styles: TemplateStringsArray,
  expressions: any[],
  theme: Record<string, any>,
  props: P,
): string {
  return expressions.reduce((result, expression, index) => {
    const value = typeof expression === 'function'
      ? expression(theme, props)
      : expression;

    return result + value + styles[index + 1];
  }, styles[0]);
}

export default interpolateStyles;
