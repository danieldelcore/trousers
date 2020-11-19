const cache: Record<string, any> = {};

function hyphenate(str: string) {
    return cache.hasOwnProperty(str)
        ? cache[str]
        : (cache[str] = str.replace(
              /[A-Z]/g,
              letter => `-${letter.toLowerCase()}`,
          ));
}

export default hyphenate;
