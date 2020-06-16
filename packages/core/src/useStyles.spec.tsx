import React, { FC, Fragment } from 'react';
import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@trousers/theme';
import styleCollector from '@trousers/collector';

import { css, useStyles } from './';

interface Props {
    isRed?: boolean;
    isBlue?: boolean;
}

describe('useStyles', () => {
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';

        cleanup();
    });

    it('returns correct className', () => {
        const styles = styleCollector('foo').element`
            background-color: blue;
        `;

        const StyledComponent = () => {
            const classNames = useStyles(styles);

            return <span className={classNames}>Ahoy!</span>;
        };

        const { container } = render(<StyledComponent />);

        expect(container.querySelector('span')!.className).toEqual(
            'foo__38890833250',
        );
    });

    it('returns correct classNames for multiple modifiers', () => {
        const styles = (props: Props) => styleCollector('foo').element`
            background-color: green;
        `.modifier(props.isRed)`
            background-color: red;
        `.modifier(props.isBlue)`
            background-color: blue;
        `;

        const StyledComponent: React.FC<Props> = props => {
            const classNames = useStyles(styles(props));

            return <span className={classNames}>Ahoy!</span>;
        };

        {
            const { container } = render(<StyledComponent />);

            expect(container.querySelector('span')!.className).toEqual(
                'foo__38262462060',
            );
        }
        {
            const { container } = render(<StyledComponent isRed />);

            expect(container.querySelector('span')!.className).toEqual(
                'foo__38262462060 foo--4911895800',
            );
        }
        {
            const { container } = render(<StyledComponent isBlue />);

            expect(container.querySelector('span')!.className).toEqual(
                'foo__38262462060 foo--38890833250',
            );
        }
        {
            const { container } = render(<StyledComponent isBlue isRed />);

            expect(container.querySelector('span')!.className).toEqual(
                'foo__38262462060 foo--4911895800 foo--38890833250',
            );
        }
    });

    it('returns correct classNames for multiple named modifiers', () => {
        const styles = (props: Props) => styleCollector('foo').element`
            background-color: blue;
        `.modifier('primary', props.isRed)`
            background-color: red;
        `.modifier('secondary', props.isBlue)`
            background-color: isBlue;
        `;

        const StyledComponent: React.FC<Props> = props => {
            const classNames = useStyles(styles(props));

            return <span className={classNames}>Ahoy!</span>;
        };

        const { container } = render(<StyledComponent />);

        expect(container.querySelector('span')!.className).toEqual(
            'foo__38890833250',
        );

        const { container: secondContainer } = render(
            <StyledComponent isRed />,
        );

        expect(secondContainer.querySelector('span')!.className).toEqual(
            'foo__38890833250 foo--primary4911895800',
        );

        const { container: thirdContainer } = render(
            <StyledComponent isBlue />,
        );

        expect(thirdContainer.querySelector('span')!.className).toEqual(
            'foo__38890833250 foo--secondary1129918790',
        );

        const { container: forthContainer } = render(
            <StyledComponent isRed isBlue />,
        );

        expect(forthContainer.querySelector('span')!.className).toEqual(
            'foo__38890833250 foo--primary4911895800 foo--secondary1129918790',
        );
    });

    it('attaches styles to the head', () => {
        const styles = styleCollector('foo').element`
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
        const styles = (props: Props) => styleCollector('foo').element`
            background-color: blue;
        `.modifier(props.isRed)`
            background-color: red;
        `;

        const StyledComponent: React.FC<Props> = props => {
            const classNames = useStyles(styles(props));

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        render(<StyledComponent isRed />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches styles with named modifiers to the head', () => {
        const styles = (props: Props) => styleCollector('foo').element`
            background-color: blue;
        `.modifier('primary', props.isRed)`
            background-color: red;
        `;

        const StyledComponent: React.FC<Props> = props => {
            const classNames = useStyles(styles(props));

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        render(<StyledComponent isRed />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches styles with multiple named modifiers to the head', () => {
        const styles = (props: Props) => styleCollector('foo').element`
            background-color: blue;
        `.modifier('primary', props.isRed)`
            background-color: red;
        `.modifier('secondary', props.isBlue)`
            background-color: isBlue;
        `;

        const StyledComponent: React.FC<Props> = props => {
            const classNames = useStyles(styles(props));

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        render(<StyledComponent isRed />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        render(<StyledComponent isBlue />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();

        render(<StyledComponent isRed isBlue />);

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

        const styles = (props: Props) => styleCollector<Theme>('foo').element`
            background-color: ${theme => theme.backgroundColor};
        `.modifier(props.isRed)`
            background-color: ${theme => theme.backgroundColor};
        `;

        const StyledComponent: React.FC<Props> = props => {
            const classNames = useStyles(styles(props));

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
        `.modifier(true)`
            background-color: red;
        `;

        const stylesAlt = styleCollector('foo').element`
            background-color: purple;
        `.modifier(true)`
            background-color: green;
        `;

        const StyledComponent: React.FC<ToggleProps> = props => {
            let activeStyles = styles;

            if (props.isAlternate) {
                activeStyles = stylesAlt;
            }

            const classNames = useStyles(activeStyles);

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

    it('attaches object style to the head', () => {
        const StyledComponent = () => {
            const classNames = useStyles({
                backgroundColor: 'blue',
            });

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches object style with pseudo states to the head', () => {
        const StyledComponent = () => {
            const classNames = useStyles({
                backgroundColor: 'blue',
                ':hover': {
                    backgroundColor: 'brown',
                },
            });

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches object style with media queries to the head', () => {
        const StyledComponent = () => {
            const classNames = useStyles({
                backgroundColor: 'blue',
                '@media (min-width: 768px)': {
                    backgroundColor: '#deecff',
                },
            });

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('attaches object style with keyframe animations to the head', () => {
        const StyledComponent = () => {
            const classNames = useStyles({
                //@ts-ignore
                backgroundColor: 'blue',
                '@keyframes rotating': {
                    //@ts-ignore
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: 'rotate(360deg)',
                    },
                },
            });

            return <span className={classNames}>Ahoy!</span>;
        };

        render(<StyledComponent />);

        expect(document.getElementsByTagName('head')[0]).toMatchSnapshot();
    });

    it('object styles with different interpolations should be mounted separately', () => {
        const Box: FC<{ testId: string; size?: number }> = ({
            testId,
            size = 40,
        }) => {
            const classNames = useStyles({
                height: `${size}px`,
                width: `${size}px`,
            });

            return <div data-testid={testId} className={classNames} />;
        };

        const { getByTestId } = render(
            <Fragment>
                <Box testId="box-1" />
                <Box testId="box-2" size={20} />
            </Fragment>,
        );

        expect(getByTestId('box-1')!.className).toEqual('css__24024913390');
        expect(getByTestId('box-2')!.className).not.toEqual('css__24024913390');
    });

    it('css styles with different interpolations should be mounted separately', () => {
        const Box: FC<{ testId: string; size?: number }> = ({
            testId,
            size = 40,
        }) => {
            const classNames = useStyles(css`
                height: ${size}px;
                width: ${size}px;
            `);

            return <div data-testid={testId} className={classNames} />;
        };

        const { getByTestId } = render(
            <Fragment>
                <Box testId="box-1" />
                <Box testId="box-2" size={20} />
            </Fragment>,
        );

        expect(getByTestId('box-1')!.className).toEqual('css__24402206290');
        expect(getByTestId('box-2')!.className).not.toEqual('css__24402206290');
    });
});
