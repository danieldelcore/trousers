import { storiesOf } from '@storybook/react';
import React, { FC, Fragment, ReactNode } from 'react';

import { withTrousers } from '../src';
import { Theme } from '../src/types';

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
    // Could we override the myComponent styles here?
    // .element('myComponent')``
    .modifier((props: ButtonProps) => !!props.primary)`
        background-color: black;
        color: white;
    `
    .Component;

storiesOf('Basic', module)
    .add('default', () => (
        <Fragment>
            <TrouseredButton>
                Base
            </TrouseredButton>
            <TrouseredButton primary>
                Primary
            </TrouseredButton>
        </Fragment>
    ));
