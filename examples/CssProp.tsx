/** @jsx jsx */
import { jsx, css, styleCollector } from '../src';
import { storiesOf } from '@storybook/react';
import { FC, Fragment, ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    primary?: boolean;
    disabled?: boolean;
}
storiesOf('CSS Prop', module)
    .add('Elements and modifiers', () => {
        const Button: FC<ButtonProps> = props => {
            const buttonStyles = styleCollector<ButtonProps>('button').element`
                background-color: #b3cde8;
                border-radius: 6px;
                border: none;
                box-shadow: inset 0 -4px #9fb8d1;
                color: white;
                display: inline-block;
                cursor: pointer;
                font-family: sans-serif;
                font-weight: 500;
                font-size: 20px;
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
            `.modifier(() => !!props!.primary)`
                background-color: #f95b5b;
                box-shadow: inset 0 -4px #c54646;
                color: #ffffff;
                :hover {
                    background-color: #e45454;
                }
                :active {
                    background-color: #c54646;
                }
            `.modifier(() => !!props!.disabled)`
                background-color: #efefef;
                box-shadow: inset 0 -4px #afafaf;
                color: #afafaf;
                cursor: not-allowed;
                :hover,
                :active {
                    color: #afafaf;
                    background-color: #efefef;
                }
            `;

            return <button css={buttonStyles}>{props.children}</button>;
        };

        return (
            <Fragment>
                <Button>Base</Button>
                <Button primary>Primary</Button>
                <Button disabled>Disabled</Button>
                <Button primary disabled>
                    Disabled Primary
                </Button>
            </Fragment>
        );
    })
    .add('Single style collector', () => {
        const Button: FC<ButtonProps> = ({ children }) => (
            <button
                css={css`
                    background-color: #b3cde8;
                    border-radius: 6px;
                    border: none;
                    box-shadow: inset 0 -4px #9fb8d1;
                    color: white;
                    display: inline-block;
                    cursor: pointer;
                    font-family: sans-serif;
                    font-weight: 500;
                    font-size: 20px;
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
                `}
            >
                {children}
            </button>
        );

        return (
            <Fragment>
                <Button>Base</Button>
            </Fragment>
        );
    });
