import css from './css';

describe('css', () => {
    it('collects id and element styles', () => {
        expect(css('Element', { color: 'red' })._get()).toMatchSnapshot();
    });

    it('collects element styles without an id supplied', () => {
        expect(css({ color: 'red' })._get()).toMatchSnapshot();
    });

    it('collects single modifier style', () => {
        expect(
            css('Element', { color: 'red' })
                .modifier('modifier', { color: 'blue' })
                ._get(),
        ).toMatchSnapshot();
    });

    it('collects multiple modifier styles', () => {
        expect(
            css('Element', { color: 'red' })
                .modifier('primary', { color: 'blue' })
                .modifier('secondary', { color: 'grey' })
                ._get(),
        ).toMatchSnapshot();
    });

    it('collects single global style', () => {
        expect(
            css('Element', {})
                .global({
                    ':root': {
                        color: 'green',
                    },
                })
                ._get(),
        ).toMatchSnapshot();
    });

    it('collects multiple global styles', () => {
        expect(
            css('Element', { color: 'red' })
                .global({
                    ':root': {
                        color: 'green',
                    },
                })
                .global({
                    '*': {
                        boxSizing: 'border-box',
                    },
                })
                ._get(),
        ).toMatchSnapshot();
    });

    it('collects single flat theme object', () => {
        expect(
            css('Element', { color: 'red' })
                .theme({
                    color: 'red',
                    background: 'blue',
                })
                ._get(),
        ).toMatchSnapshot();
    });

    it('collects single camel case flat theme object', () => {
        expect(
            css('Element', { color: 'red' })
                .theme({
                    primaryColor: 'red',
                    primaryBackground: 'blue',
                })
                ._get(),
        ).toMatchSnapshot();
    });

    it('collects single deep theme object', () => {
        expect(
            css('Element', { color: 'red' })
                .theme({
                    color: {
                        foreground: 'red',
                        background: 'blue',
                    },
                })
                ._get(),
        ).toMatchSnapshot();
    });

    it('collects multiple theme objects', () => {
        expect(
            css('Element', { color: 'red' })
                .theme({
                    typography: {
                        size: '18px',
                        font: 'ariel',
                    },
                })
                .theme({
                    color: {
                        foreground: 'red',
                        background: 'blue',
                    },
                })
                ._get(),
        ).toMatchSnapshot();
    });
});
