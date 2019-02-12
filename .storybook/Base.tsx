import { storiesOf } from '@storybook/react';
import React, { FC, Fragment, ReactNode } from 'react';

import { trousers, useTrousers } from '../src';

const buttonStyles = trousers()
    .element`
        background-color: red;
        border: 2px solid black;
        transition: color 300ms;

        :hover {
            background-color: blue;
            color: white;
        }

        .button-span {
            font-size: 20px;
        }
    `
    .modifier((props: any) => !!props.primary)`
        background-color: black;
        color: white;
    `;

interface ButtonProps {
    children: ReactNode;
    className?: string;
    primary?: boolean;
}

const Button: FC<ButtonProps> = ({ className, children }) => {
    console.log(buttonStyles.get());


    return (
        <button className={className}>
            <span className="button-span">
                {children}
            </span>
        </button>
    )
};

storiesOf('Basic', module)
    .add('default', () => (
        <Fragment>
            <Button>
                Base
            </Button>
            <Button primary>
                Primary
            </Button>
        </Fragment>
    ));
