import { camelToKebabCase } from './util';

const msPattern = /^ms-/;
const cache: Record<string, any> = {};

function hyphenate(name: any) {
    if (cache.hasOwnProperty(name)) return cache[name];

    const hName = camelToKebabCase(name);
    return (cache[name] = msPattern.test(hName) ? '-' + hName : hName);
}

function parse(styleObject: Record<string, any>) {
    return Object.keys(styleObject).reduce((accum, key) => {
        const val = styleObject[key];

        if (typeof val !== 'string') {
            accum += `\n${key} {${parse(val)}}`;
        } else {
            accum += hyphenate(key) + ':' + val + ';';
        }

        return accum;
    }, '');
}

export default parse;
