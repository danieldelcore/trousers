import stylis from 'stylis';

const ATTRIBUTE_ID = 'data-trousers';

let styleElement: HTMLStyleElement;

export default function renderStyles(
    className: string,
    styles: string
) {
    if (!isMounted()) mountToHead();

    const processedStyles = stylis(className, styles);

    appendStyle(`${processedStyles}\n`);
}

function isMounted(): boolean {
    return !!styleElement;
}

function mountToHead() {
    const headElement = document.getElementsByTagName('head')[0];

    styleElement = document.createElement('style');
    styleElement.setAttribute(ATTRIBUTE_ID, '');
    styleElement.type = 'text/css';

    headElement.appendChild(styleElement);
};

function appendStyle(styles: string) {
    const styleNode = document.createTextNode(styles);

    styleElement.appendChild(styleNode);
}
