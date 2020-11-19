/** @jsx jsx */
import { storiesOf } from '@storybook/react';
import { FC, ReactNode, Fragment } from 'react';

import css from '@trousers/core';
import jsx from '@trousers/react';

storiesOf('Performance', module)
    .add('Many of the same nodes', () => {
        interface ButtonProps {
            children: ReactNode;
        }

        const styles = css('button', {
            backgroundColor: '#b3cde8',
            borderRadius: '6px',
            border: 'none',
            boxShadow: 'inset 0 -4px #9fb8d1',
            color: 'white',
            display: 'inline-block',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            fontWeight: 500,
            letterSpacing: '1px',
            margin: '5px 10px',
            padding: '10px 20px 14px 20px',
            textDecoration: 'none',
            transition: 'background-color 300ms, color 300ms',
            outline: 'none',
            ':hover': {
                backgroundColor: '#adc6e0',
                color: 'rgba(255, 255, 255, 0.8)',
            },
            ':active': {
                backgroundColor: '#9fb8d1',
            },
        });

        const Button: FC<ButtonProps> = props => {
            return <button css={styles}>{props.children}</button>;
        };

        return (
            <Fragment>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
                <Button>Hello</Button>
            </Fragment>
        );
    })
    .add('Many nodes with different nodes', () => {
        const Dot: FC<{ color: string }> = props => (
            <div
                css={css('dot', {
                    backgroundColor: props.color,
                    width: '8px',
                    height: '8px',
                    borderRadius: '100%',
                    display: 'inline-block',
                    margin: '4px',
                })}
            >
                {props.children}
            </div>
        );

        const intToColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        return (
            <Fragment>
                {[...Array(500)].map((_, i) => (
                    <Dot color={intToColor()} key={i} />
                ))}
            </Fragment>
        );
    });
