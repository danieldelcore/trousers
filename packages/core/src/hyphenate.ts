const cache: Record<string, any> = {};

function hyphenate(str: string) {
    if (cache.hasOwnProperty(str)) return cache[str];
    return (cache[str] = str.replace(
        /[A-Z]/g,
        letter => `-${letter.toLowerCase()}`,
    ));
}

export default hyphenate;
