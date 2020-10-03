var uppercasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var cache: Record<string, any> = {};

function toHyphenLower(match: any) {
    return '-' + match.toLowerCase();
}

function hyphenate(name: any) {
    if (cache.hasOwnProperty(name)) {
        return cache[name];
    }

    var hName = name.replace(uppercasePattern, toHyphenLower);
    return (cache[name] = msPattern.test(hName) ? '-' + hName : hName);
}

function parse(styleObject: Record<string, any>) {
    var keys = Object.keys(styleObject);
    if (!keys.length) return '';
    let i: number;
    let len = keys.length;
    var result = '';

    for (i = 0; i < len; i++) {
        var key = keys[i];
        var val = styleObject[key];

        if (typeof val !== 'string') {
            result += parse(val);
        } else {
            result += hyphenate(key) + ':' + val + ';';
        }
    }

    return result;
}

export default parse;
