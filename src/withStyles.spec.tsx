import React from 'react';
import { render, cleanup } from '@testing-library/react';

import {
    css,
    withStyles,
    WithStylesProps,
    ThemeProvider,
    styleCollector,
} from './';

interface Props extends WithStylesProps {
    isRed?: boolean;
}

describe('withStyles', () => {
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';

        cleanup();
    });

    it('attaches styles to the head', () => {
        const styles = styleCollector<Props, {}, {}>('foo').element`
            background-color: blue;
        `;

        const StyledComponent = withStyles(({ className }) => {
            return <span className={className}>Ahoy!</span>;
        }, styles);

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches styles with modifiers to the head', () => {
        const styles = styleCollector<Props, {}, {}>('foo').element`
            background-color: blue;
        `.modifier(props => !!props!.isRed)`
            background-color: red;
        `;

        const StyledComponent = withStyles(({ className }) => {
            return <span className={className}>Ahoy!</span>;
        }, styles);

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        render(<StyledComponent isRed />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches themed styles to the head', () => {
        interface Theme {
            backgroundColor: string;
            backgroundColorSecondary: string;
        }

        const theme: Theme = {
            backgroundColor: 'purple',
            backgroundColorSecondary: 'green',
        };

        const styles = styleCollector<Props, {}, Theme>('foo').element`
            background-color: ${theme => theme.backgroundColor};
        `.modifier(props => !!props!.isRed)`
            background-color: ${theme => theme.backgroundColor};
        `;

        const StyledComponent = withStyles(({ className }) => {
            return <span className={className}>Ahoy!</span>;
        }, styles);

        render(
            <ThemeProvider theme={theme}>
                <StyledComponent />
            </ThemeProvider>,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        render(
            <ThemeProvider theme={theme}>
                <StyledComponent isRed />
            </ThemeProvider>,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches single style to the head', () => {
        const StyledComponent = withStyles<Props, {}>(
            ({ className }) => <span className={className}>Ahoy!</span>,
            css`
                background-color: blue;
            `,
        );

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches themed single style to the head', () => {
        interface Theme {
            backgroundColor: string;
        }

        const theme = {
            backgroundColor: 'Atomic Tangerine',
        };

        const StyledComponent = withStyles<Props, Theme>(
            ({ className }) => <span className={className}>Ahoy!</span>,
            css<Theme>`
                background-color: ${theme => theme.backgroundColor};
            `,
        );

        render(
            <ThemeProvider theme={theme}>
                <StyledComponent />
            </ThemeProvider>,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });
});
