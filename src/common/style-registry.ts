import stylis from 'stylis';

import interpolateStyles from './interpolate-styles';

const ATTRIBUTE_ID = 'data-trousers';

export function registerStyle<Theme>(className: string, styles: TemplateStringsArray, expressions: any[], theme: Theme) {
    if (!isMounted()) mountToHead();

    const rawStyles = interpolateStyles(styles, expressions, theme);
    const processedStyles = stylis(className, rawStyles);

    appendStyle(`${processedStyles}\n`);
}

function isMounted(): boolean {
    const headElement = document.getElementsByTagName('head')[0];

    return !!headElement.querySelectorAll(`style[${ATTRIBUTE_ID}]`).length;
}

function mountToHead() {
    const headElement = document.getElementsByTagName('head')[0];
    const styleElement = document.createElement('style');

    styleElement.setAttribute(ATTRIBUTE_ID, '');
    styleElement.type = 'text/css';

    headElement.appendChild(styleElement);
};

function appendStyle(styles: string) {
    const styleNode = document.createTextNode(styles);

    document
        .getElementsByTagName('head')[0]
        .querySelectorAll(`style[${ATTRIBUTE_ID}]`)[0]
        .appendChild(styleNode);
}
