import registry, { Registry } from './registry';

describe('Registry', () => {
    let clientRegistry: Registry;
    let element: HTMLHeadElement;
    let attributeId: string;

    beforeEach(() => {
        element = document.createElement('head');
        attributeId = 'data-testing-trousers';

        clientRegistry = registry(element, attributeId);
    });

    it('registers a new style', () => {
        const key = '1';
        const style = 'background-color:red;';

        clientRegistry.register(key, style);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registers multiple styles', () => {
        clientRegistry.register('1', 'background-color:red;');
        clientRegistry.register('2', 'background-color:blue;');

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registers a global style', () => {
        const key = '1';
        const style = 'background-color:red;';

        clientRegistry.register(key, style, true);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registers a global, with preexisting style tag', () => {
        clientRegistry.register('1', 'background-color:red;');
        clientRegistry.register('2', 'background-color:blue;', true);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registering an existing key does not update the style', () => {
        const key = '1';
        const style = 'background-color:red;';
        const styleBlue = 'background-color:blue;';

        clientRegistry.register(key, style);
        clientRegistry.register(key, styleBlue);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('detects an existing style', () => {
        const key = '1';
        const style = 'background-color:red;';

        clientRegistry.register(key, style);

        expect(clientRegistry.has('1')).toBe(true);
    });

    it('detects a non existing style', () => {
        expect(clientRegistry.has('123')).toBe(false);
    });

    it('registries can mount their own style tags', () => {
        const secondaryRegistry = registry(element, 'data-testing-secondary', {
            forceNewNode: true,
        });

        clientRegistry.register('1', 'background-color:red;');
        secondaryRegistry.register('2', 'background-color:blue;');

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registries can hoist style tags to the top', () => {
        const secondaryRegistry = registry(element, 'data-testing-secondary', {
            forceNewNode: true,
            appendBefore: attributeId,
        });

        clientRegistry.register('1', 'background-color:red;');
        secondaryRegistry.register('2', 'background-color:blue;', true);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registries will append style node if append before selector returns null', () => {
        const secondaryRegistry = registry(element, 'data-testing-secondary', {
            forceNewNode: true,
            appendBefore: 'data-unknown-element',
        });

        secondaryRegistry.register('1', 'background-color:blue;');

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('clears multiple mounted style tags', () => {
        const secondaryRegistry = registry(element, 'data-testing-secondary', {
            forceNewNode: true,
        });

        clientRegistry.register('1', 'background-color:red;');
        secondaryRegistry.register('2', 'background-color:blue;');

        expect(element.childElementCount).toEqual(2);

        secondaryRegistry.clear();

        expect(element.childElementCount).toEqual(1);

        clientRegistry.clear();

        expect(element.childElementCount).toEqual(0);
    });
});
