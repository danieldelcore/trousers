import sheet from './sheet';

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

    beforeEach(() => {
        activeSheet = sheet(headEl, attributeId);
    });

    afterEach(() => {
        window.document.head.innerHTML = '';
    });

    it('mounts a new style', () => {
        const key = '.foo';
        const style = { 'background-color': 'red' };
        const styleRule = styleToString(key, style);

        activeSheet.mount(key, styleRule);

        expect(activeSheet.has(key)).toEqual(true);
        expect(headEl.innerHTML).toMatchSnapshot();
        // @ts-ignore
        expect(document.styleSheets[0].cssRules[0]).toHaveMountedStyles(
            key,
            style,
        );
    });

    it('mounts style with multiple properties', () => {
        const key = '.foo';
        const style = { color: 'blue', 'background-color': 'red' };
        const styleRule = styleToString(key, style);

        activeSheet.mount(key, styleRule);

        expect(activeSheet.has(key)).toEqual(true);
        // @ts-ignore
        expect(document.styleSheets[0].cssRules[0]).toHaveMountedStyles(
            key,
            style,
        );
    });

    it('mounts multiple styles', () => {
        const key1 = '.blue';
        const key2 = '.red';
        const style1 = { 'background-color': 'blue' };
        const style2 = { 'background-color': 'red' };

        activeSheet.mount(key1, styleToString(key1, style1));
        activeSheet.mount(key2, styleToString(key2, style2));

        // @ts-ignore
        expect(document.styleSheets[0].cssRules[0]).toHaveMountedStyles(
            key1,
            style1,
        );
        // @ts-ignore
        expect(document.styleSheets[0].cssRules[1]).toHaveMountedStyles(
            key2,
            style2,
        );
    });

    it('detects an existing style', () => {
        const key = '.foo';

        activeSheet.mount(key, styleToString(key, { color: 'red' }));

        expect(activeSheet.has(key)).toEqual(true);
    });

    it('detects a non existing style', () => {
        expect(activeSheet.has('123')).toBe(false);
    });

    it('mounts a global style', () => {
        const key = '.1';
        const style = { 'background-color': 'red' };

        activeSheet.mount(key, styleToString(key, style));

        // @ts-ignore
        expect(document.styleSheets[0].cssRules[0]).toHaveMountedStyles(
            key,
            style,
        );
    });

    it('mounts a global, with pre-existing style tag', () => {
        const key1 = '.blue';
        const key2 = '.red';
        const style1 = { 'background-color': 'blue' };
        const style2 = { 'background-color': 'red' };

        activeSheet.mount(key1, styleToString(key1, style1));
        activeSheet.mount(key2, styleToString(key2, style2), true);

        // @ts-ignore
        expect(document.styleSheets[0].cssRules[1]).toHaveMountedStyles(
            key1,
            style1,
        );
        // @ts-ignore
        expect(document.styleSheets[0].cssRules[0]).toHaveMountedStyles(
            key2,
            style2,
        );
    });

    it('registering an existing key does not update the style', () => {
        const key = '.blue';
        const style1 = { 'background-color': 'blue' };
        const style2 = { 'background-color': 'red' };

        activeSheet.mount(key, styleToString(key, style1));
        activeSheet.mount(key, styleToString(key, style2));

        expect(document.styleSheets[0].cssRules.length).toEqual(1);
        // @ts-ignore
        expect(document.styleSheets[0].cssRules[0]).toHaveMountedStyles(
            key,
            style1,
        );
    });

    it('can mount a style tag', () => {
        sheet(headEl, 'data-testing-secondary');

        expect(headEl.innerHTML).toMatchSnapshot();
    });
});
