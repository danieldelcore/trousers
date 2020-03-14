/**
 * @jest-environment node
 */

/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrate } from 'react-dom';
import { JSDOM } from 'jsdom';

import {
    jsx,
    StyleCollector,
    SingleStyleCollector,
    ThemeProvider,
    styleCollector,
    useStyles,
    css,
    useGlobals,
    ServerProvider,
    ServerRegistry,
} from './';

interface ButtonProps {
    children: ReactNode;
    primary?: boolean;
}

interface Theme {
    default: string;
    primary: string;
}

describe('Server side rendering (SSR)', () => {
    let styles: (props: ButtonProps) => StyleCollector<Theme>;
    let globalStyles: SingleStyleCollector<Theme>;
    let Button: FC<ButtonProps>;
    let theme: Theme;

    beforeEach(() => {
        theme = {
            default: '#b3cde8',
            primary: '#f95b5b',
        };

        globalStyles = css<Theme>`
            * {
                background-color: red;
            }
        `;

        styles = (props: ButtonProps) => styleCollector<Theme>('button')
            .element`
                background-color: ${theme => theme.default};
                color: white;
            `.modifier(props.primary)`
                background-color: ${theme => theme.primary};
                color: #ffffff;
            `;

        Button = props => {
            const classNames = useStyles(styles(props));

            return <button className={classNames}>{props.children}</button>;
        };
    });

    afterEach(() => {
        // @ts-ignore
        global.window = undefined;
        // @ts-ignore
        global.document = undefined;
    });

    it('stringify styles on server and hydrate on client', () => {
        jest.spyOn(console, 'warn');

        const App: FC = () => (
            <ThemeProvider theme={theme}>
                <Button>Hello, SSR!</Button>
                <Button primary>Hello, Hydration!</Button>
            </ThemeProvider>
        );

        const registry = new ServerRegistry();

        const html = renderToString(
            <ServerProvider registry={registry}>
                <App />
            </ServerProvider>,
        );

        const jsdom = new JSDOM(`<!doctype html><html><body></body></html>`);
        const { window } = jsdom;

        // @ts-ignore
        global.window = window;
        // @ts-ignore
        global.document = window.document;

        const root = document.createElement('div');
        root.innerHTML = html;

        expect(() => hydrate(<App />, root)).not.toThrow();
        expect(html).toMatchSnapshot();
        expect(registry.get()).toMatchSnapshot();
        expect(console.warn).not.toHaveBeenCalled();
    });

    it('stringify styles(css prop) on server and hydrate on client', () => {
        jest.spyOn(console, 'warn');

        Button = props => {
            return <button css={styles(props)}>{props.children}</button>;
        };

        const App: FC = () => (
            <ThemeProvider theme={theme}>
                <Button>Hello, SSR!</Button>
                <Button primary>Hello, Hydration!</Button>
            </ThemeProvider>
        );

        const registry = new ServerRegistry();

        const html = renderToString(
            <ServerProvider registry={registry}>
                <App />
            </ServerProvider>,
        );

        const jsdom = new JSDOM(`<!doctype html><html><body></body></html>`);
        const { window } = jsdom;

        // @ts-ignore
        global.window = window;
        // @ts-ignore
        global.document = window.document;

        const root = document.createElement('div');
        root.innerHTML = html;

        expect(() => hydrate(<App />, root)).not.toThrow();
        expect(html).toMatchSnapshot();
        expect(registry.get()).toMatchSnapshot();
        expect(console.warn).not.toHaveBeenCalled();
    });

    it('stringify globals on server and hydrate on client', () => {
        jest.spyOn(console, 'warn');

        const App: FC = () => {
            useGlobals(globalStyles);

            return <p>Hello world</p>;
        };

        const registry = new ServerRegistry();

        const html = renderToString(
            <ServerProvider registry={registry}>
                <App />
            </ServerProvider>,
        );

        const jsdom = new JSDOM(`<!doctype html><html><body></body></html>`);
        const { window } = jsdom;

        // @ts-ignore
        global.window = window;
        // @ts-ignore
        global.document = window.document;

        const root = document.createElement('div');
        root.innerHTML = html;

        expect(() => hydrate(<App />, root)).not.toThrow();
        expect(html).toMatchSnapshot();
        expect(registry.get()).toMatchSnapshot();
        expect(console.warn).not.toHaveBeenCalled();
    });

    it('throws if ServerProvider was not used', () => {
        const App: FC = () => (
            <ThemeProvider theme={theme}>
                <Button>Hello, SSR!</Button>
                <Button primary>Hello, Hydration!</Button>
            </ThemeProvider>
        );

        expect(() => renderToString(<App />)).toThrowError(
            'Server style registry is required for SSR, did you forget to use <ServerProvider/>?',
        );
    });
});
