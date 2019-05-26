import { storiesOf } from '@storybook/react';
import React, { FC, Fragment, useState, useEffect } from 'react';

import { css, styleCollector, useStyles } from '../src';

storiesOf('Miscellaneous', module)
    .add('State transitions', () => {
        const logoStyles = styleCollector('logo').element`
                    width: 150px;
                    height: auto;
                    margin: 15px;
                    padding: 15px;
                    background-color: #b3cde8;
                    border-radius: 150px;
                    animation: rotating 2s linear infinite;
                    transition: background-color linear 300ms;
                    cursor: pointer;
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
    .add('Mount/Dismount', () => {
        interface LogoProps {
            primary?: boolean;
        }

        const logoStyles = styleCollector<LogoProps, {}, {}>('logo').element`
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
            const classNames = useStyles<LogoProps, {}, {}>(logoStyles, props);

            return (
                <img
                    className={classNames}
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
                        <div onClick={() => setActive(true)}>
                            <Logo />
                        </div>
                    ) : (
                        <div onClick={() => setActive(false)}>
                            <Logo primary />
                        </div>
                    )}
                </Fragment>
            );
        };

        return <Toggle />;
    })
    .add('CSS function as element', () => {
        const styles = css`
            background-color: #b3cde8;
            border-radius: 150px;
            color: white;
            font: 500 20px sans-serif;
            height: auto;
            letter-spacing: 1px;
            margin: 15px;
            padding: 15px;
            width: 350px;
            text-align: center;
        `;

        const Element: FC = () => {
            const className = useStyles(styles);

            return (
                <div className={className}>
                    I am styled with plain CSS function
                </div>
            );
        };

        return <Element />;
    });
