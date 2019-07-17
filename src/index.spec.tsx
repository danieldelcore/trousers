/**
 * @jest-environment node
 */

import React, { FC, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrate } from 'react-dom';
import { JSDOM } from 'jsdom';

import {
    StyleCollector,
    SingleStyleCollector,
    ThemeProvider,
    styleCollector,
    useStyles,
    css,
    useGlobals,
    ServerProvider,
    ServerStyleRegistry,
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
    let styles: StyleCollector<ButtonProps, {}, Theme>;
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

        styles = styleCollector<ButtonProps, {}, Theme>('button').element`
                background-color: ${theme => theme.default};
                color: white;
            `.modifier(props => !!props!.primary)`
                background-color: ${theme => theme.primary};
                color: #ffffff;
            `;

        Button = props => {
            const classNames = useStyles<ButtonProps, {}, Theme>(styles, props);

            return <button className={classNames}>{props.children}</button>;
        };
    });

    afterEach(() => {
        // @ts-ignore
        global.window = undefined;
        // @ts-ignore
        global.document = undefined;
    });

    it('stringify application on server and hydrate on client', () => {
        jest.spyOn(console, 'warn');
        jest.spyOn(console, 'error');

        const App: FC = () => {
            useGlobals(globalStyles);

            return (
                <ThemeProvider theme={theme}>
                    <Button>Hello, SSR!</Button>
                    <Button primary>Hello, Hydration!</Button>
                </ThemeProvider>
            );
        };

        const registry = new ServerStyleRegistry();

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
        expect(console.error).not.toHaveBeenCalled();
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
