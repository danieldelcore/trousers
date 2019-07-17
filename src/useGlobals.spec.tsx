import React from 'react';
import { render, cleanup } from '@testing-library/react';

import {
    css,
    useGlobals,
    SingleStyleCollector,
    ThemeProvider,
    useStyles,
    styleCollector,
} from './';

interface Theme {
    backgroundColor: string;
}

interface FixtureProps {
    styles: SingleStyleCollector<Theme> | SingleStyleCollector<Theme>[];
}

describe('useGlobals', () => {
    let theme: Theme;
    let globalStyles: SingleStyleCollector<Theme>;
    let GlobalyStyledComponent: React.FC<FixtureProps>;

    beforeEach(() => {
        globalStyles = css`
            * {
                box-sizing: border-box;
            }
        `;

        theme = {
            backgroundColor: 'red',
        };

        GlobalyStyledComponent = ({ styles }: FixtureProps) => {
            useGlobals(styles);

            return <span>Ahoy!</span>;
        };
    });

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';

        cleanup();
    });

    it('attaches styles to the head', () => {
        render(<GlobalyStyledComponent styles={globalStyles} />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches an array of styles to the head', () => {
        const additionalStyles = css`
            * {
                background-color: blue;
            }
        `;

        render(
            <GlobalyStyledComponent
                styles={[globalStyles, additionalStyles]}
            />,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches new styles when a new style collector is supplied', () => {
        const additionalStyles = css`
            * {
                background-color: blue;
            }
        `;

        const { rerender } = render(
            <GlobalyStyledComponent styles={globalStyles} />,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        rerender(<GlobalyStyledComponent styles={additionalStyles} />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('styles are not duplicated on rerender', () => {
        const { rerender } = render(
            <GlobalyStyledComponent styles={globalStyles} />,
        );
        rerender(<GlobalyStyledComponent styles={globalStyles} />);
        rerender(<GlobalyStyledComponent styles={globalStyles} />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches themed styles to the head', () => {
        const themedStyles = css<Theme>`
            * {
                background-color: ${theme => theme.backgroundColor};
            }
        `;

        render(
            <ThemeProvider theme={theme}>
                <GlobalyStyledComponent styles={themedStyles} />
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

        render(
            <ThemeProvider theme={theme}>
                <GlobalyStyledComponent styles={[globalStyles, themedStyles]} />
            </ThemeProvider>,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches styles before data-trousers', () => {
        const styles = styleCollector('hello').element`
            color: blue;
        `;

        const MyComponent = () => {
            const classNames = useStyles(styles);

            return <div className={classNames}>Hello!</div>;
        };

        render(
            <React.Fragment>
                <MyComponent />
                <GlobalyStyledComponent styles={globalStyles} />
            </React.Fragment>,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('clears styles', () => {
        const { unmount } = render(
            <GlobalyStyledComponent styles={globalStyles} />,
        );

        expect(document.querySelectorAll('style').length).toEqual(1);

        unmount();

        expect(document.querySelectorAll('style').length).toEqual(0);
    });

    it('clears an array of styles', () => {
        const additionalStyles = css`
            * {
                background-color: blue;
            }
        `;

        const { unmount } = render(
            <GlobalyStyledComponent
                styles={[globalStyles, additionalStyles]}
            />,
        );

        expect(document.querySelectorAll('style').length).toEqual(1);

        unmount();

        expect(document.querySelectorAll('style').length).toEqual(0);
    });

    it('clears altered styles', () => {
        const additionalStyles = css`
            * {
                background-color: blue;
            }
        `;

        const { rerender, unmount } = render(
            <GlobalyStyledComponent styles={globalStyles} />,
        );

        expect(document.querySelectorAll('style').length).toEqual(1);

        rerender(<GlobalyStyledComponent styles={additionalStyles} />);

        unmount();

        expect(document.querySelectorAll('style').length).toEqual(0);
    });
});
