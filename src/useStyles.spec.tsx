import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { css, useStyles, ThemeProvider, styleCollector } from './';

interface Props {
    isRed?: boolean;
}

describe('useStyles', () => {
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';

        cleanup();
    });

    it('attaches styles to the head', () => {
        const styles = styleCollector<Props>('foo').element`
            background-color: blue;
        `;

        const StyledComponent = () => {
            const classNames = useStyles(styles);

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches styles with modifiers to the head', () => {
        const styles = styleCollector<Props>('foo').element`
            background-color: blue;
        `.modifier(props => !!props!.isRed)`
            background-color: red;
        `;

        const StyledComponent: React.FC<Props> = props => {
            const classNames = useStyles(styles, props);

            return <span className={classNames}>Ahoy!</span>;
        };

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

        const StyledComponent: React.FC<Props> = props => {
            const classNames = useStyles(styles, props);

            return <span className={classNames}>Ahoy!</span>;
        };

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

    it('attaches new styles when a new style collector is supplied', () => {
        interface ToggleProps extends Props {
            isAlternate?: boolean;
        }

        const styles = styleCollector<ToggleProps>('foo').element`
            background-color: blue;
        `.modifier(() => true)`
            background-color: red;
        `;

        const stylesAlt = styleCollector<ToggleProps>('foo').element`
            background-color: purple;
        `.modifier(() => true)`
            background-color: green;
        `;

        const StyledComponent: React.FC<ToggleProps> = props => {
            let activeStyles = styles;

            if (props.isAlternate) {
                activeStyles = stylesAlt;
            }

            const classNames = useStyles(activeStyles, props);

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent isRed />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        render(<StyledComponent isRed isAlternate />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches single style to the head', () => {
        const StyledComponent = () => {
            const classNames = useStyles(css`
                background-color: blue;
            `);

            return <span className={classNames}>Ahoy!</span>;
        };

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
        const StyledComponent = () => {
            const classNames = useStyles(
                css<Theme>`
                    background-color: ${theme => theme.backgroundColor};
                `,
            );

            return <span className={classNames}>Ahoy!</span>;
        };

        render(
            <ThemeProvider theme={theme}>
                <StyledComponent />
            </ThemeProvider>,
        );

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });
});
