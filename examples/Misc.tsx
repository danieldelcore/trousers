import { storiesOf } from '@storybook/react';
import React, { FC, Fragment, useState, MouseEventHandler } from 'react';
import { useStableRefTester, RenderCount } from 'react-stable-ref';

import { css, useStyles, useGlobals } from '@trousers/core';
import styleCollector from '@trousers/collector';
import { ThemeProvider } from '@trousers/theme';

storiesOf('Miscellaneous', module)
    .add('State transitions', () => {
        const logoStyles = css`
            width: 150px;
            height: auto;
            margin: 15px;
            padding: 15px;
            background-color: #b3cde8;
            border-radius: 150px;
        `;

        const TrousersLogo: FC = () => {
            const logoClassnames = useStyles(logoStyles);

            useStableRefTester();

            return (
                <Fragment>
                    <p>
                        Render count: <RenderCount />
                    </p>
                    <img
                        className={logoClassnames}
                        src="trousers-logo.png"
                        alt={`Trousers Logo`}
                    />
                </Fragment>
            );
        };

        return <TrousersLogo />;
    })
    .add('State transitions (Globals)', () => {
        interface Theme {
            color: string;
        }

        const theme: Theme = {
            color: '#ff5d9e',
        };

        const globalStyles = css<Theme>`
            * {
                color: ${theme => theme.color};
            }
        `;

        const styles = styleCollector('block').element`
                background-color: #404b69;
                color: blue;
                padding: 20px;
                border: none;
                border-radius: 6px;
                letter-spacing: 1px;
                font-family: 'Press Start 2P', sans-serif;
                text-align: center;

                h2 {
                    font-size: 40px;
                }
            `;

        const TextBlock: FC = () => {
            useGlobals<Theme>(globalStyles);
            useStableRefTester();

            const classNames = useStyles(styles);

            return (
                <div className={classNames}>
                    <p>
                        Render count: <RenderCount />
                    </p>
                    <h2>Themed global Styles!</h2>
                    <p>I should be pink!</p>
                </div>
            );
        };

        return (
            <ThemeProvider theme={theme}>
                <TextBlock />
            </ThemeProvider>
        );
    })
    .add('Alternating style collectors', () => {
        const logoStyles = css`
            width: 150px;
            height: auto;
            margin: 15px;
            padding: 15px;
            background-color: #b3cde8;
            border-radius: 150px;
        `;

        const logoStylesAlt = css`
            width: 150px;
            height: auto;
            margin: 15px;
            padding: 15px;
            background-color: #f6e3e3;
        `;

        const TrousersLogo: FC = () => {
            const count = useStableRefTester();
            const logoClassnames = useStyles(
                count % 2 ? logoStyles : logoStylesAlt,
            );

            return (
                <Fragment>
                    <p>
                        Render count: <RenderCount />
                    </p>
                    <img
                        className={logoClassnames}
                        src="trousers-logo.png"
                        alt={`Trousers Logo ${count}`}
                    />
                </Fragment>
            );
        };

        return <TrousersLogo />;
    })
    .add('Alternating themes', () => {
        interface Theme {
            primaryColor: string;
        }

        const lightTheme = {
            primaryColor: '#b3cde8',
        };

        const darkTheme = {
            primaryColor: '#f6e3e3',
        };

        const logoStyles = css<Theme>`
            width: 150px;
            height: auto;
            margin: 15px;
            padding: 15px;
            background-color: ${theme => theme.primaryColor};
            border-radius: 150px;
        `;

        const TrousersLogo: FC = () => {
            const logoClassnames = useStyles(logoStyles);

            return (
                <img
                    className={logoClassnames}
                    src="trousers-logo.png"
                    alt={`Trousers Logo`}
                />
            );
        };

        const Alternator: FC = () => {
            const count = useStableRefTester();

            return (
                <ThemeProvider theme={count % 2 ? lightTheme : darkTheme}>
                    <p>
                        Render count: <RenderCount />
                    </p>
                    <TrousersLogo />
                </ThemeProvider>
            );
        };

        return <Alternator />;
    })
    .add('Mount/Dismount', () => {
        interface LogoProps {
            primary?: boolean;
            onClick: MouseEventHandler;
        }

        const logoStyles = (props: LogoProps) => styleCollector<LogoProps>(
            'logo',
        ).element`
                width: 150px;
                height: auto;
                margin: 15px;
                padding: 15px;
                background-color: #b3cde8;
                border-radius: 150px;
                animation: rotating 2s linear infinite;
                transition: background-color linear 300ms;
                cursor: pointer;
            `.modifier(!!props.primary)`
                background-color: #f6e3e3;
            `;

        const Logo: FC<LogoProps> = props => {
            const classNames = useStyles(logoStyles(props));

            return (
                <img
                    className={classNames}
                    onClick={e => props.onClick(e)}
                    src="trousers-logo.png"
                    alt={`Trousers Logo`}
                />
            );
        };

        const Toggle: FC = () => {
            const [active, setActive] = useState(false);

            return (
                <Fragment>
                    <p>Press to mount/unmount</p>
                    {!active ? (
                        <Logo onClick={() => setActive(true)} />
                    ) : (
                        <Logo primary onClick={() => setActive(false)} />
                    )}
                    <Logo onClick={() => setActive(true)} />
                    <Logo primary onClick={() => setActive(false)} />
                </Fragment>
            );
        };

        return <Toggle />;
    });
