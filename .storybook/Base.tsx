import React, { FC, Fragment, ReactNode } from 'react';
import { storiesOf } from '@storybook/react';

import { withTrousers } from '../src';

interface ButtonProps {
    children: ReactNode;
    className?: string;
    primary?: boolean;
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
    background-color: ${(theme: any) => theme.primaryColor};
    border: 2px solid black;
    transistion: color 300ms;

    :hover {
        background-color: blue;
        color: white;
    }

    .button-span {
        font-size: 20px;
    }

    ${({ primary }: ButtonProps) =>
        primary && `
            background-color: purple;
            color: white;
        `
    }
`;

storiesOf('Basic', module)
    .add('Button', () => (
        <Fragment>
            <TrouseredButton>
                Base
            </TrouseredButton>
            <TrouseredButton primary>
                Primary
            </TrouseredButton>
        </Fragment>
    ));
