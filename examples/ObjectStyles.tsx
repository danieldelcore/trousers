/** @jsx jsx */
import { jsx, useStyles } from '@trousers/core';
import { storiesOf } from '@storybook/react';
import { FC, PropsWithChildren } from 'react';

const foo = {
    backgroundColor: '#b3cde8',
    borderRadius: '6px',
    border: 'none',
    boxShadow: 'inset 0 -4px #9fb8d1',
    color: 'white',
    display: 'inline-block',
    cursor: 'pointer',
    letterSpacing: '1px',
    margin: '5px 10px',
    padding: '10px 20px 14px 20px',
    textDecoration: 'none',
    transition: 'background-color 300ms, color 300ms',
    outline: 'none',
    'font-family': 'sans-serif',
    'font-weight': 500,
    'font-size': '20px',
    ':hover': {
        backgroundColor: '#adc6e0',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    ':active': {
        backgroundColor: '#9fb8d1',
    },
};

storiesOf('Object styles', module)
    .add('Css prop', () => {
        const Button: FC<PropsWithChildren<{}>> = ({ children }) => (
            <button css={foo}>{children}</button>
        );

        return <Button>Base</Button>;
    })
    .add('useStyle', () => {
        const Button: FC<PropsWithChildren<{}>> = ({ children }) => {
            const className = useStyles(foo);
            return <button className={className}>{children}</button>;
        };

        return <Button>Base</Button>;
    });
