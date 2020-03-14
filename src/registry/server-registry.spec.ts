/**
 * @jest-environment node
 */

import ServerRegistry from './server-registry';

describe('ServerRegistry', () => {
    let registry: ServerRegistry;

    beforeEach(() => {
        registry = new ServerRegistry();
    });

    it('registers a new style', () => {
        const key = '1';
        const style = 'background-color:red;';

        registry.register(key, style);

        expect(registry.get()).toMatchSnapshot();
    });

    it('registering an existing key does not update the style', () => {
        const key = '1';
        const style = 'background-color:red;';
        const styleBlue = 'background-color:blue;';

        registry.register(key, style);
        registry.register(key, styleBlue);

        expect(registry.get()).toMatchSnapshot();
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

    it('renders registered styles in the right format', () => {
        registry.register('1', 'background-color:red;');
        registry.register('2', 'background-color:blue;');

        expect(registry.get()).toMatchSnapshot();
    });

    it('globals are rendered before styles', () => {
        // TO-DO
    });

    it('multiple globals are rendered in their own tags', () => {
        // TO-DO
    });
});
