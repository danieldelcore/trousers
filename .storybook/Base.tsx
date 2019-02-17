import { storiesOf } from '@storybook/react';
import React, { FC, Fragment, ReactNode } from 'react';

import { trousers, useTrousers } from '../src';

interface ButtonProps {
    children: ReactNode;
    primary?: boolean;
    disabled?: boolean;
}

const buttonStyles = trousers<ButtonProps>()
    .element`
        background-color: #acdeaa;
        border-radius: 6px;
        border: none;
        box-shadow: inset 0 -4px #8fbbaf;
        color: white;
        display: inline-block;
        cursor: pointer;
        font-weight: 500;
        letter-spacing: 1px;
        margin: 0.2px 10px;
        padding: 10px 20px 14px 20px;
        text-decoration: none;
        transition: background-color 300ms, color 300ms;
        outline: none;

        :hover {
            background-color: #a4d4a2;
            color: rgba(255, 255, 255, 0.8);
        }

        :active {
            background-color: #8fbbaf;
        }
    `
    .modifier(props => !!props.primary)`
        background-color: #f95b5b;
        box-shadow: inset 0 -4px #c54646;
        color: #ffffff;

        :hover {
            background-color: #e45454;
        }

        :active {
            background-color: #c54646;
        }
    `
    .modifier(props => !!props.disabled)`
        background-color: #efefef;
        box-shadow: inset 0 -4px #afafaf;
        color: #afafaf;
        pointer-events: none;
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
    .add('Default', () => (
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
