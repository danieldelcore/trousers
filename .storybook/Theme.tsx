import { storiesOf } from '@storybook/react';
import React, { FC, ReactNode } from 'react';

import { Theme, ThemeProvider, withTrousers } from '../src';

const lightTheme = {
    primaryColor: 'white',
    text: 'black',
};

const darkTheme = {
    primaryColor: 'black',
    text: 'white',
};

interface ButtonProps {
    children: ReactNode;
    className?: string;
    primary?: boolean;
}

const Button: FC<ButtonProps> = ({ className, children }) => (
    <button className={className}>
        <span className="button-span">
            {children}
        </span>
    </button>
);

const TrouseredButton = withTrousers<ButtonProps>(Button)
    .block`
        background-color: ${(theme: Theme) => theme.primaryColor};
        color: ${(theme: Theme) => theme.text};
        border: 2px solid black;
    `
    .Component;

storiesOf('Theme', module)
    .add('Default', () => (
        <ThemeProvider theme={lightTheme}>
            <TrouseredButton>
                Base
            </TrouseredButton>
        </ThemeProvider>
    ))
    .add('Sibling ThemeProviders', () => (
        <ThemeProvider theme={lightTheme}>
            <TrouseredButton>
                Light
            </TrouseredButton>
            <ThemeProvider theme={darkTheme}>
                <TrouseredButton>
                    Dark
                </TrouseredButton>
            </ThemeProvider>
        </ThemeProvider>
    ))
    .add('Nested ThemeProviders', () => (
        <ThemeProvider theme={lightTheme}>
            <TrouseredButton>
                Light
            </TrouseredButton>
            <ThemeProvider theme={darkTheme}>
                <TrouseredButton>
                    Dark
                </TrouseredButton>
            </ThemeProvider>
        </ThemeProvider>
    ));
