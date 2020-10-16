/** @jsx jsx */
import { storiesOf } from '@storybook/react';
import { FC, ReactNode, Fragment } from 'react';

import css from '@trousers/core';
import jsx from '@trousers/react';

const lightTheme = css('theme-light', {}).theme({
    backgroundColor: '#f3f3f3',
    hoverColor: '#dcdcdc',
    textColor: '#6f6f6f',
    borderColor: '#cacaca',
});

const darkTheme = css('theme-dark', {}).theme({
    backgroundColor: '#585858',
    hoverColor: '#484848',
    textColor: 'white',
    borderColor: '#333',
});

interface ButtonProps {
    children: ReactNode;
}

const buttonStyles = css('button', {
    backgroundColor: 'var(--background-color)',
    borderRadius: '6px',
    border: 'none',
    boxShadow: 'inset 0 -4px var(--border-color)',
    color: 'var(--text-color)',
    cursor: 'pointer',
    display: 'inline-block',
    fontFamily: 'sans-serif',
    fontSize: '20px',
    fontWeight: 'normal',
    letterSpacing: '1px',
    margin: '5px 10px',
    outline: 'none',
    padding: '10px 20px 14px 20px',
    textDecoration: 'none',
    transition: 'background-color 300ms, color 300ms',
    ':hover': {
        backgroundColor: 'var(--hover-color)',
    },
    ':active': {
        backgroundColor: 'var(--border-color)',
    },
});

const Button: FC<ButtonProps> = props => (
    <button css={buttonStyles}>{props.children}</button>
);

storiesOf('Theme', module)
    .add('Default', () => (
        <div css={lightTheme}>
            <Button>Themed Button!</Button>
        </div>
    ))
    .add('Sibling themes', () => (
        <Fragment>
            <div css={lightTheme}>
                <Button>Light Theme</Button>
            </div>
            <div css={darkTheme}>
                <Button>Dark Theme</Button>
            </div>
        </Fragment>
    ))
    .add('Nested themes', () => (
        <div css={lightTheme}>
            <Button>Light Theme</Button>
            <div css={darkTheme}>
                <Button>Nested Dark Theme</Button>
            </div>
        </div>
    ))
    .add('No theme in context', () => <Button>No theme OMG!</Button>);
