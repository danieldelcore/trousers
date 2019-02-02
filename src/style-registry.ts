export function appendToHead(styles: string) {
    const css = document.createElement('style');
    css.setAttribute('data-trousers', '');
    css.type = 'text/css';
    css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("head")[0].appendChild(css);
}
