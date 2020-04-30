import { storiesOf } from '@storybook/react';
import React, { FC } from 'react';

import { css, useStyles, useGlobals } from '@trousers/core';
import styleCollector from '@trousers/collector';
import { ThemeProvider } from '@trousers/theme';

storiesOf('Globals', module)
    .add('Global styles', () => {
        const globalStyles = css`
            * {
                color: #f95b5b;
            }
        `;

        const globalFontStyles = css`
            @import url('https://fonts.googleapis.com/css?family=Press+Start+2P');
        `;

        const styles = styleCollector('block').element`
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
            useGlobals(globalFontStyles);
            useGlobals(globalStyles);

            const classNames = useStyles(styles);

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
            const classNames = useStyles(styles);

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
