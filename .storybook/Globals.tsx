import { storiesOf } from '@storybook/react';
import React, { FC, useEffect } from 'react';

import { trousers, css, useTrousers, useGlobal, ThemeProvider } from '../src';

storiesOf('Globals', module)
    .add('Global styles', () => {
        const globalStyles = css<{}>`
            * {
                color: #f95b5b;
            }
        `;

        const globalFontStyles = css<{}>`
            @import url('https://fonts.googleapis.com/css?family=Press+Start+2P');
        `;

        const styles = trousers().element`
                background-color: #eaf2fd;
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
            const [clearFont] = useGlobal(globalFontStyles);
            const [clearStyles] = useGlobal(globalStyles);

            const classNames = useTrousers<{}, {}>('block', {}, styles);

            useEffect(
                () => () => {
                    clearFont();
                    clearStyles();
                },
                [],
            );

            return (
                <div className={classNames}>
                    <h2>Global Styles!</h2>
                    <p>I should be red!</p>
                </div>
            );
        };

        return <TextBlock />;
    })
    .add('Global styles with theme', () => {
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

        const styles = trousers().element`
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
            const [clearStyles] = useGlobal<Theme>(globalStyles);

            const classNames = useTrousers<{}, {}>('block', {}, styles);

            useEffect(() => () => clearStyles(), []);

            return (
                <div className={classNames}>
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
    });
