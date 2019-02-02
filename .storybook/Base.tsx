import React, { FC, ReactNode } from 'react';
import { storiesOf } from '@storybook/react';

import { withTrousers } from '../src';

interface ButtonProps {
    className?: string;
    children: ReactNode;
}

const Button: FC<ButtonProps> = ({ className, children }) => {
    return (
        <button className={className}>
            <span className="button-span">
                {children}
            </span>
        </button>
    );
}

const TrouseredButton = withTrousers<ButtonProps>(Button)`
    background-color: red;
    border: 2px solid black;

    :hover {
        background-color: blue;
        color: white;
    }

    .button-span {
        font-size: 20px;
    }
`;

storiesOf('Basic', module)
    .add('Button', () => (
        <TrouseredButton>
            YO!
        </TrouseredButton>
    ));
