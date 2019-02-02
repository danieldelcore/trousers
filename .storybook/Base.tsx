import React, { FC, ReactNode } from 'react';
import { storiesOf } from '@storybook/react';

import { withTrousers } from '../src';

interface ButtonProps {
    children: ReactNode;
}

const Button: FC<ButtonProps> = ({ children }) => {
    return (
        <button>{children}</button>
    );
}

const TrouseredButton = withTrousers(Button)`
    background-color: red;
    border: 2px solid black;
`;

storiesOf('Basic', module)
    .add('Button', () => (
        <TrouseredButton>
            YO!
        </TrouseredButton>
    ));
