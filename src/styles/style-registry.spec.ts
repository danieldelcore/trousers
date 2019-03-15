import StyleRegistry from './style-registry';

describe('StyleRegistry', () => {
    let registry: StyleRegistry;
    let element: HTMLHeadElement;
    let attributeId: string;

    beforeEach(() => {
        element = document.createElement('head');
        attributeId = 'data-testing-trousers';

        registry = new StyleRegistry(element, attributeId);
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
});
