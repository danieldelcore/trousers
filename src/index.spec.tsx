/**
 * @jest-environment node
 */

import React, { FC, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrate } from 'react-dom';
import { JSDOM } from 'jsdom';

import {
    StyleCollector,
    ThemeProvider,
    trousers,
    useTrousers,
} from './';

interface ButtonProps {
    children: ReactNode;
    primary?: boolean;
}

interface Theme {
    default: string;
    primary: string;
}

describe('Server side rendering', () => {
    let styles: StyleCollector<ButtonProps, Theme>;
    let Button: FC<ButtonProps>;
    let theme: Theme;

    beforeEach(() => {
        theme = {
            default: '#b3cde8',
            primary: '#f95b5b',
        };

        styles = trousers<ButtonProps, Theme>().element`
                background-color: ${theme => theme.default};
                color: white;
            `.modifier(props => !!props.primary)`
                background-color: ${theme => theme.primary};
                color: #ffffff;
            `;

        Button = props => {
            const classNames = useTrousers<ButtonProps, Theme>('button', props, styles);

            return (
                <button className={classNames}>
                    {props.children}
                </button>
            );
        };
    });

    it('stringify application on server and hydrate on client', () => {
        jest.spyOn(console, 'warn');

        const App: FC = () => (
            <ThemeProvider theme={theme}>
                <Button>Hello, SSR!</Button>
                <Button primary>Hello, Hydration!</Button>
            </ThemeProvider>
        );

        const element = React.createElement(App);
        const html = renderToString(element);

        const jsdom = new JSDOM(`<!doctype html><html><body></body></html>`);
        const { window } = jsdom;

        // @ts-ignore
        global.window = window;
        // @ts-ignore
        global.document = window.document;

        const root = document.createElement('div');
        root.innerHTML = html;

        expect(() => hydrate(<App />, root)).not.toThrow();
        expect(console.warn).not.toHaveBeenCalled();
    });
});
