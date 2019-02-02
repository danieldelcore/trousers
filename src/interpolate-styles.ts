function interpolateStyles(
  styles: string[],
  expressions: any[],
  props: any,
): string {
  return expressions.reduce((result, expression, index) => {
    const value = typeof expression === 'function'
      ? expression(props)
      : expression;

    return result + value + styles[index + 1];
  }, styles[0]);
}

export default interpolateStyles;
