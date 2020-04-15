const splitRules = (str: string) =>
    str
        .split('}')
        .filter(str => str.match(/[\S]+/))
        .reduce<string[]>((accum, str, i) => {
            if (i > 0) {
                const prev = accum.length - 1;
                const openCount = (accum[prev].match(/{/g) || []).length;
                const closeCount = (accum[prev].match(/}/g) || []).length;

                if (openCount > closeCount) {
                    accum[prev] = accum[prev] + str + '}';
                    return accum;
                }
            }

            accum.push(str + '}');
            return accum;
        }, []);

export default splitRules;
