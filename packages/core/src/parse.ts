import { camelToKebabCase } from './util';

const msPattern = /^ms-/;
const cache: Record<string, any> = {};

function hyphenate(name: any) {
    if (cache.hasOwnProperty(name)) return cache[name];

    const hName = camelToKebabCase(name);
    return (cache[name] = msPattern.test(hName) ? '-' + hName : hName);
}

function parse(styleObject: Record<string, any>) {
    const keys = Object.keys(styleObject);

    if (!keys.length) return '';

    let result = '';

    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = styleObject[key];

        if (typeof val !== 'string') {
            result += parse(val);
        } else {
            console.log(hyphenate(key));

            result += hyphenate(key) + ':' + val + ';';
        }
    }

    return result;
}

export default parse;
