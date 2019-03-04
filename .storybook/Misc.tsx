import { storiesOf } from '@storybook/react';
import React, { FC, Fragment, ReactNode, useState, useEffect } from 'react';

import { trousers, useTrousers } from '../src';

storiesOf('Miscellaneous', module)
    .add('State transitions', () => {
        const logoStyles = trousers()
            .element`
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
            const logoClassnames = useTrousers('logo', {}, logoStyles);

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

        return (
            <TrousersLogo />
        );
    })
