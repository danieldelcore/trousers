import { storiesOf } from '@storybook/react';
import React, {
    FC,
    Fragment,
    useState,
    useEffect,
    MouseEventHandler,
} from 'react';

import { css, styleCollector, useStyles, ThemeProvider } from '../src';

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
            const [count, setCount] = useState(0);
            const logoClassnames = useStyles(logoStyles);

            useEffect(() => {
                const ts = setTimeout(() => setCount(count + 1), 1000);

                return () => clearTimeout(ts);
            });

            return (
                <Fragment>
                    <p>{count}</p>
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
            const [count, setCount] = useState(0);
            const [styleCollector, setStyleCollector] = useState(logoStylesAlt);
            const logoClassnames = useStyles(styleCollector);

            useEffect(() => {
                const ts = setTimeout(() => {
                    const nextTick = count + 1;

                    setStyleCollector(
                        nextTick % 2 ? logoStyles : logoStylesAlt,
                    );

                    setCount(nextTick);
                }, 1000);

                return () => clearTimeout(ts);
            });

            return (
                <Fragment>
                    <p>{count}</p>
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

        const lightTheme: Theme = {
            primaryColor: '#b3cde8',
        };

        const darkTheme: Theme = {
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
            const [count, setCount] = useState(0);
            const [theme, setTheme] = useState(darkTheme);

            useEffect(() => {
                const ts = setTimeout(() => {
                    const nextTick = count + 1;
                    console.log(nextTick);

                    setTheme(nextTick % 2 ? lightTheme : darkTheme);
                    setCount(nextTick);
                }, 1000);

                return () => clearTimeout(ts);
            });

            return (
                <ThemeProvider theme={theme}>
                    <p>{count}</p>
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

        const logoStyles = styleCollector<LogoProps>('logo').element`
                width: 150px;
                height: auto;
                margin: 15px;
                padding: 15px;
                background-color: #b3cde8;
                border-radius: 150px;
                animation: rotating 2s linear infinite;
                transition: background-color linear 300ms;
                cursor: pointer;
            `.modifier(props => !!props!.primary)`
                background-color: #f6e3e3;
            `;

        const Logo: FC<LogoProps> = props => {
            const classNames = useStyles(logoStyles, props);

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
                    {!active ? (
                        <Logo onClick={() => setActive(true)} />
                    ) : (
                        <Logo primary onClick={() => setActive(false)} />
                    )}
                </Fragment>
            );
        };

        return <Toggle />;
    });
