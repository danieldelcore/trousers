import React, { FC } from 'react';

import { trousers, useTrousers } from 'trousers';

const buttonStyles = trousers
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

const spanStyles = trousers
    .element`
        background-color: ${theme => theme.primaryColor};
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

const Button: FC<any> = props => {
    const buttonClassNames = useTrousers('Button', props, trousers);
    const spanClassNames = useTrousers('Button_span', props, trousers);

    return (
        <button className={buttonClassNames}>
            <span className={spanClassNames}>
                {props.children}
            </span>
        </button>
    );
};
