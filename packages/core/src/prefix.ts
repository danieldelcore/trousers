import { prefixProperty } from 'tiny-css-prefixer';

// TODO might be good to return an object here instead.
const prefix = (prop: string, value: string | number) => {
    const flag = prefixProperty(prop);
    let css = `${prop}: ${value};\n`;
    if (flag & 0b001) css += `-ms-${css}`;
    if (flag & 0b010) css += `-moz-${css}`;
    if (flag & 0b100) css += `-webkit-${css}`;
    return css;
};

export default prefix;
