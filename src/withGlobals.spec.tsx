import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { css, withGlobals, SingleStyleCollector, ThemeProvider } from './';

interface Theme {
    backgroundColor: string;
}

describe('useGlobals', () => {
    let theme: Theme;
    let globalStyles: SingleStyleCollector<Theme>;
    let UnstyledComponent: React.FC<{}>;

    beforeEach(() => {
        globalStyles = css`
            * {
                box-sizing: border-box;
            }
        `;

        theme = {
            backgroundColor: 'red',
        };

        UnstyledComponent = () => {
            return <span>Ahoy!</span>;
        };
    });

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';

        cleanup();
    });

    it('attaches styles to the head', () => {
        const GloballyStyledComponent = withGlobals(
            UnstyledComponent,
            globalStyles,
        );

        render(<GloballyStyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches an array of styles to the head', () => {
        const additionalStyles = css`
            * {
                background-color: blue;
            }
        `;

        const GloballyStyledComponent = withGlobals(UnstyledComponent, [
            globalStyles,
            additionalStyles,
        ]);

        render(<GloballyStyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('styles are not duplicated on rerender', () => {
        const GloballyStyledComponent = withGlobals(
            UnstyledComponent,
            globalStyles,
        );

        const { rerender } = render(<GloballyStyledComponent />);

        rerender(<GloballyStyledComponent />);
        rerender(<GloballyStyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches themed styles to the head', () => {
        const themedStyles = css<Theme>`
            * {
                background-color: ${theme => theme.backgroundColor};
            }
        `;

        const GloballyStyledComponent = withGlobals(
            UnstyledComponent,
            themedStyles,
        );

        render(
            <ThemeProvider theme={theme}>
                <GloballyStyledComponent />
            </ThemeProvider>,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches an array of themed styles to the head', () => {
        const themedStyles = css<Theme>`
            * {
                background-color: ${theme => theme.backgroundColor};
            }
        `;

        const GloballyStyledComponent = withGlobals(UnstyledComponent, [
            globalStyles,
            themedStyles,
        ]);

        render(
            <ThemeProvider theme={theme}>
                <GloballyStyledComponent />
            </ThemeProvider>,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('clears styles', () => {
        const GloballyStyledComponent = withGlobals(
            UnstyledComponent,
            globalStyles,
        );

        const { unmount } = render(<GloballyStyledComponent />);

        expect(document.querySelectorAll('style').length).toEqual(1);

        unmount();

        expect(document.querySelectorAll('style').length).toEqual(0);
    });
});
