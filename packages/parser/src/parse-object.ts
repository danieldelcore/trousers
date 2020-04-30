const camelToKebab = (str: string) => {
    const regex = RegExp(/[A-Z]/, 'g');
    return !str.match(regex)
        ? str
        : str.replace(regex, match => `-${match.toLowerCase()}`);
};

const parseObject = (
    styleObj: Record<string, any>,
    parser = camelToKebab,
): string =>
    Object.keys(styleObj)
        .map(property =>
            typeof styleObj[property] === 'string'
                ? `${parser(property)}: ${styleObj[property]};`
                : `${parser(property)} {\n${parseObject(
                      styleObj[property],
                  )}\n}`,
        )
        .join('\n');

export default parseObject;
