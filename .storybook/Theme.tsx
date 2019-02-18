import { storiesOf } from '@storybook/react';
import React, { FC, ReactNode, Fragment } from 'react';

import { ThemeProvider, useTrousers, trousers } from '../src';

interface Theme {
    backgroundColor: string;
    hoverColor: string;
    textColor: string;
    borderColor: string;
}

const lightTheme = {
    backgroundColor: '#f3f3f3',
    hoverColor: '#dcdcdc',
    textColor: '#6f6f6f',
    borderColor: '#cacaca',
};

const darkTheme = {
    backgroundColor: '#585858',
    hoverColor: '#484848',
    textColor: 'white',
    borderColor: '#333',
};

interface ButtonProps {
    children: ReactNode;
}

const buttonStyles = trousers<ButtonProps, Theme>()
    .element`
        background-color: ${({ backgroundColor }) => backgroundColor};
        border-radius: 6px;
        border: none;
        box-shadow: inset 0 -4px ${({ borderColor }) => borderColor};
        color: ${({ textColor }) => textColor};
        cursor: pointer;
        display: inline-block;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 1px;
        margin: 0.2px 10px;
        outline: none;
        padding: 10px 20px 14px 20px;
        text-decoration: none;
        transition: background-color 300ms, color 300ms;

        :hover {
            background-color: ${({ hoverColor }) => hoverColor};
            color: rgba(255, 255, 255, 0.8);
        }

        :active {
            background-color: ${({ borderColor }) => borderColor};
        }
    `;

const Button: FC<ButtonProps> = props => {
    const classNames = useTrousers<ButtonProps, Theme>('button', props, buttonStyles);

    return (
        <button className={classNames}>
            {props.children}
        </button>
    );
};

storiesOf('Theme', module)
    .add('Default', () => (
        <ThemeProvider theme={lightTheme}>
            <Button>Themed Button!</Button>
        </ThemeProvider>
    ))
    .add('Sibling ThemeProviders', () => (
        <Fragment>
            <ThemeProvider theme={lightTheme}>
                <Button>Light Theme</Button>
            </ThemeProvider>
            <ThemeProvider theme={darkTheme}>
                <Button>Dark Theme</Button>
            </ThemeProvider>
        </Fragment>
    ))
    .add('Nested ThemeProviders', () => (
        <ThemeProvider theme={lightTheme}>
            <Button>Light Theme</Button>
            <ThemeProvider theme={darkTheme}>
                <Button>Nested Dark Theme</Button>
            </ThemeProvider>
        </ThemeProvider>
    ))
    .add('No theme in context', () => (
        <Button>No theme OMG!</Button>
    ));
