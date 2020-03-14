import Registry from './registry';

describe('Registry', () => {
    let registry: Registry;
    let element: HTMLHeadElement;
    let attributeId: string;

    beforeEach(() => {
        element = document.createElement('head');
        attributeId = 'data-testing-trousers';

        registry = new Registry(element, attributeId);
    });

    it('registers a new style', () => {
        const key = '1';
        const style = 'background-color:red;';

        registry.register(key, style);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registers multiple styles', () => {
        registry.register('1', 'background-color:red;');
        registry.register('2', 'background-color:blue;');

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registers a global style', () => {
        const key = '1';
        const style = 'background-color:red;';

        registry.register(key, style, true);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registers a global, with preexisting style tag', () => {
        registry.register('1', 'background-color:red;');
        registry.register('2', 'background-color:blue;', true);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registering an existing key does not update the style', () => {
        const key = '1';
        const style = 'background-color:red;';
        const styleBlue = 'background-color:blue;';

        registry.register(key, style);
        registry.register(key, styleBlue);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('detects an existing style', () => {
        const key = '1';
        const style = 'background-color:red;';

        registry.register(key, style);

        expect(registry.has('1')).toBe(true);
    });

    it('detects a non existing style', () => {
        expect(registry.has('123')).toBe(false);
    });

    it('registries can mount their own style tags', () => {
        const secondaryRegistry = new Registry(
            element,
            'data-testing-secondary',
            {
                forceNewNode: true,
            },
        );

        registry.register('1', 'background-color:red;');
        secondaryRegistry.register('2', 'background-color:blue;');

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registries can hoist style tags to the top', () => {
        const secondaryRegistry = new Registry(
            element,
            'data-testing-secondary',
            {
                forceNewNode: true,
                appendBefore: attributeId,
            },
        );

        registry.register('1', 'background-color:red;');
        secondaryRegistry.register('2', 'background-color:blue;', true);

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('registries will append style node if append before selector returns null', () => {
        const secondaryRegistry = new Registry(
            element,
            'data-testing-secondary',
            {
                forceNewNode: true,
                appendBefore: 'data-unknown-element',
            },
        );

        secondaryRegistry.register('1', 'background-color:blue;');

        expect(element.innerHTML).toMatchSnapshot();
    });

    it('clears multiple mounted style tags', () => {
        const secondaryRegistry = new Registry(
            element,
            'data-testing-secondary',
            {
                forceNewNode: true,
            },
        );

        registry.register('1', 'background-color:red;');
        secondaryRegistry.register('2', 'background-color:blue;');

        expect(element.childElementCount).toEqual(2);

        secondaryRegistry.clear();

        expect(element.childElementCount).toEqual(1);

        registry.clear();

        expect(element.childElementCount).toEqual(0);
    });
});
