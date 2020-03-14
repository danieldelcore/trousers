const styleSheet = (attributes: Record<string, any>) => {
    const style = document.createElement('style');

    Object.keys(attributes).forEach(attr => {
        style.setAttribute(attr, attributes[attr]);
    });

    // WebKit hack :(
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);

    return style.sheet as CSSStyleSheet;
};

export default styleSheet;
