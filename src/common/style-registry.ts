import stylis from 'stylis';

import { StyleDefinition } from '../types';
import { interpolateStyles } from './';

const ATTRIBUTE_ID = 'data-trousers';

export default function renderStyles<Theme>(
    className: string,
    styleDefinition: StyleDefinition,
    theme: Theme
) {
    if (!isMounted()) mountToHead();

    const rawStyles = interpolateStyles(
        styleDefinition.styles,
        styleDefinition.expressions,
        theme
    );

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
