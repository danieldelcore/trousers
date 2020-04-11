import { storiesOf } from '@storybook/react';
import React, { FC, ReactNode, Fragment } from 'react';

import { useStyles } from '@trousers/core';
import styleCollector from '@trousers/collector';

storiesOf('Performance', module).add('Many of the same nodes', () => {
    interface ButtonProps {
        children: ReactNode;
    }

    const styles = styleCollector<ButtonProps>('button').element`
            background-color: #b3cde8;
            border-radius: 6px;
            border: none;
            box-shadow: inset 0 -4px #9fb8d1;
            color: white;
            display: inline-block;
            cursor: pointer;
            font-family: sans-serif;
            font-weight: 500;
            letter-spacing: 1px;
            margin: 5px 10px;
            padding: 10px 20px 14px 20px;
            text-decoration: none;
            transition: background-color 300ms, color 300ms;
            outline: none;

            :hover {
                background-color: #adc6e0;
                color: rgba(255, 255, 255, 0.8);
            }

            :active {
                background-color: #9fb8d1;
            }
        `;

    const Button: FC<ButtonProps> = props => {
        const buttonClassNames = useStyles(styles);

        return <button className={buttonClassNames}>{props.children}</button>;
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
});
