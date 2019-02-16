import { storiesOf } from '@storybook/react';
import React, { FC, Fragment, ReactNode } from 'react';

import { trousers, useTrousers } from '../src';

interface ButtonProps {
    children: ReactNode;
    className?: string;
    primary?: boolean;
    disabled?: boolean;
}

const buttonStyles = trousers<ButtonProps>()
    .element`
        background-color: red;
        border: 2px solid black;
        transition: color 300ms;
        margin: 0 10px;
        padding: 5px 10px;
        border-radius: 3px;

        :hover {
            background-color: blue;
            color: white;
        }
    `
    .modifier(props => !!props.primary)`
        background-color: blue;
        border: 2px solid black;
        color: white;

        :hover {
            background-color: yellow;
            color: black;
        }
    `
    .modifier(props => !!props.disabled)`
        background-color: grey;
        border: 2px solid grey;
        color: darkgrey;
    `;

const buttonSpanStyles = trousers<{}>()
    .element`
        font-size: 20px;
    `;

const Button: FC<ButtonProps> = props => {
    const buttonClassNames = useTrousers<ButtonProps>('button', props, buttonStyles);
    const buttonSpanClassNames = useTrousers<{}>('button-span', props, buttonSpanStyles);

    return (
        <button className={buttonClassNames}>
            <span className={buttonSpanClassNames}>
                {props.children}
            </span>
        </button>
    );
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
            <Button disabled>
                Disabled
            </Button>
            <Button primary disabled>
                Both
            </Button>
        </Fragment>
    ));
