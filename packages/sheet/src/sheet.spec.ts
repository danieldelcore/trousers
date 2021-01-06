import sheet from './sheet';

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveMountedStyles(key: string, style: object): R;
        }
    }
}

const objectContaining = (
    obj: Record<string, any>,
    subObj: Record<string, any>,
) =>
    Object.keys(subObj).reduce((accum, key) => {
        if (accum === false || !obj.hasOwnProperty(key)) return false;
        return obj[key] === subObj[key];
    }, true);

const styleToString = (key: string, style: object) => {
    const styles = Object.entries(style).reduce(
        (accum, [rule, property]) => `${accum}${rule}:${property};`,
        '',
    );

    return `${key}{${styles}}`;
};

expect.extend({
    toHaveMountedStyles(cssRuleList, selectorText, rules) {
        const pass =
            cssRuleList.selectorText === selectorText &&
            objectContaining(cssRuleList.style, rules);

        const message = pass
            ? () =>
                  `Expected: not ${selectorText} ${this.utils.printExpected(
                      cssRuleList,
                  )}\n` +
                  `Received: ${
                      cssRuleList.selectorText
                  }${this.utils.printReceived(rules)}`
            : () =>
                  `Expected: ${selectorText} ${this.utils.printExpected(
                      cssRuleList,
                  )}\n` +
                  `Received: ${
                      cssRuleList.selectorText
                  }${this.utils.printReceived(rules)}`;

        return {
            pass,
            message,
        };
    },
});

describe('Sheet', () => {
    let activeSheet: ReturnType<typeof sheet>;
    let headEl = window.document.head;
    let attributeId = 'data-testing-trousers';
    let styleSheet: CSSStyleSheet;

    beforeEach(() => {
        activeSheet = sheet(headEl, attributeId);
        styleSheet = document.styleSheets[0];
    });

    afterEach(() => {
        window.document.head.innerHTML = '';
    });

    it('can mount a style tag', () => {
        sheet(headEl, 'data-testing-secondary');
        expect(headEl.innerHTML).toMatchSnapshot();
    });

    it('detects an existing style', () => {
        const key = '.foo';
        activeSheet.mount(key, styleToString(key, { color: 'red' }));

        expect(activeSheet.has(key)).toEqual(true);
    });

    it('detects a non existing style', () => {
        expect(activeSheet.has('123')).toBe(false);
    });

    it('mounts a new style', () => {
        const key = '.foo';
        const style = { color: 'red' };
        const styleRule = styleToString(key, style);

        activeSheet.mount(key, styleRule);

        expect(activeSheet.has(key)).toEqual(true);
        expect(headEl.innerHTML).toMatchSnapshot();
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style);
    });

    it('mounts style with multiple properties', () => {
        const key = '.foo';
        const style = { color: 'blue', backgroundColor: 'red' };
        const styleRule = styleToString(key, style);

        activeSheet.mount(key, styleRule);

        expect(activeSheet.has(key)).toEqual(true);
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style);
    });

    it('mounts multiple styles', () => {
        const key1 = '.blue';
        const key2 = '.red';
        const style1 = { color: 'blue' };
        const style2 = { color: 'red' };

        activeSheet.mount(key1, styleToString(key1, style1));
        activeSheet.mount(key2, styleToString(key2, style2));

        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key1, style1);
        expect(styleSheet.cssRules[1]).toHaveMountedStyles(key2, style2);
    });

    it('mounts a global style', () => {
        const key = '.1';
        const style = { color: 'red' };

        activeSheet.mount(key, styleToString(key, style));

        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style);
    });

    it('mounts a global, with pre-existing style tag', () => {
        const key1 = '.blue';
        const key2 = 'body';
        const style1 = { color: 'blue' };
        const style2 = { color: 'red' };

        activeSheet.mount(key1, styleToString(key1, style1));
        activeSheet.mount(key2, styleToString(key2, style2), true);

        expect(styleSheet.cssRules[1]).toHaveMountedStyles(key1, style1);
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key2, style2);
    });

    it('registering an existing key does not update the style', () => {
        const key = '.blue';
        const style1 = { color: 'blue' };
        const style2 = { color: 'red' };

        activeSheet.mount(key, styleToString(key, style1));
        activeSheet.mount(key, styleToString(key, style2));

        expect(styleSheet.cssRules.length).toEqual(1);
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style1);
    });

    it('unmounts style as the only mounted style', () => {
        const key = '.foo';
        const style = { color: 'red' };
        const styleRule = styleToString(key, style);

        activeSheet.mount(key, styleRule);

        expect(activeSheet.has(key)).toEqual(true);
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style);

        activeSheet.unmount(key);
    });

    it('unmounts style as one of many mounted styles', () => {
        const key = '.foo';
        const style = {
            color: 'red',
        };

        activeSheet.mount('.bar', '.bar{color: blue;}');
        activeSheet.mount(key, styleToString(key, style));
        activeSheet.mount('.baz', '.baz{color: green;}');

        expect(activeSheet.has(key)).toEqual(true);
        expect(styleSheet.cssRules.length).toEqual(3);
        expect(styleSheet.cssRules[1]).toHaveMountedStyles(key, style);

        activeSheet.unmount(key);

        expect(activeSheet.has(key)).toEqual(false);
        expect(styleSheet.cssRules.length).toEqual(2);
        expect(styleSheet.cssRules[0]).not.toHaveMountedStyles(key, style);
        expect(styleSheet.cssRules[1]).not.toHaveMountedStyles(key, style);
    });

    it('mounts then unmount all styles in order', () => {
        const key = '.foo';
        const style = {
            color: 'red',
        };
        const key2 = '.bar';
        const style2 = {
            color: 'blue',
        };
        const key3 = '.baz';
        const style3 = {
            color: 'green',
        };

        activeSheet.mount(key, styleToString(key, style));
        activeSheet.mount(key2, styleToString(key2, style2));
        activeSheet.mount(key3, styleToString(key3, style3));

        expect(styleSheet.cssRules.length).toEqual(3);
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style);
        expect(styleSheet.cssRules[1]).toHaveMountedStyles(key2, style2);
        expect(styleSheet.cssRules[2]).toHaveMountedStyles(key3, style3);

        activeSheet.unmount(key);
        expect(activeSheet.has(key)).toEqual(false);
        expect(styleSheet.cssRules.length).toEqual(2);
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key2, style2);
        expect(styleSheet.cssRules[1]).toHaveMountedStyles(key3, style3);

        activeSheet.unmount(key2);
        expect(activeSheet.has(key2)).toEqual(false);
        expect(styleSheet.cssRules.length).toEqual(1);

        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key3, style3);

        activeSheet.unmount(key3);
        expect(activeSheet.has(key3)).toEqual(false);
        expect(styleSheet.cssRules.length).toEqual(0);
    });

    it('mounts then unmounts all styles from middle of array', () => {
        const key = '.foo';
        const style = {
            color: 'red',
        };
        const key2 = '.bar';
        const style2 = {
            color: 'blue',
        };
        const key3 = '.baz';
        const style3 = {
            color: 'green',
        };

        activeSheet.mount(key, styleToString(key, style));
        activeSheet.mount(key2, styleToString(key2, style2));
        activeSheet.mount(key3, styleToString(key3, style3));

        expect(styleSheet.cssRules.length).toEqual(3);
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style);
        expect(styleSheet.cssRules[1]).toHaveMountedStyles(key2, style2);
        expect(styleSheet.cssRules[2]).toHaveMountedStyles(key3, style3);

        activeSheet.unmount(key2);
        expect(activeSheet.has(key2)).toEqual(false);
        expect(styleSheet.cssRules.length).toEqual(2);
        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style);
        expect(styleSheet.cssRules[1]).toHaveMountedStyles(key3, style3);

        activeSheet.unmount(key);
        expect(activeSheet.has(key)).toEqual(false);
        expect(styleSheet.cssRules.length).toEqual(1);

        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key3, style3);

        activeSheet.unmount(key3);
        expect(activeSheet.has(key3)).toEqual(false);
        expect(styleSheet.cssRules.length).toEqual(0);
    });

    it('unmounts a global style', () => {
        const key = ':root';
        const style = { color: 'red' };

        activeSheet.mount(key, styleToString(key, style), true);

        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key, style);
    });

    it('unmounts a global style as one of many mounted global styles', () => {
        const key = ':root';
        const style = { color: 'red' };
        const key2 = 'body';
        const style2 = { color: 'blue' };
        const key3 = '*';
        const style3 = { color: 'green' };

        activeSheet.mount(key, styleToString(key, style), true);
        activeSheet.mount(key2, styleToString(key2, style2), true);
        activeSheet.mount(key3, styleToString(key3, style3), true);

        expect(activeSheet.has(key)).toEqual(true);
        expect(styleSheet.cssRules.length).toEqual(3);
        expect(styleSheet.cssRules[2]).toHaveMountedStyles(key, style);

        activeSheet.unmount(key);

        expect(styleSheet.cssRules.length).toEqual(2);

        expect(styleSheet.cssRules[0]).toHaveMountedStyles(key3, style3);
        expect(styleSheet.cssRules[1]).toHaveMountedStyles(key2, style2);
    });
});
