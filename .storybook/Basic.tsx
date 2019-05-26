import { storiesOf } from '@storybook/react';
import React, { FC, Fragment, ReactNode, useState } from 'react';

import { styleCollector, useStyles } from '../src';

storiesOf('Basic', module)
    .add('Elements and modifiers', () => {
        interface ButtonProps {
            children: ReactNode;
            primary?: boolean;
            disabled?: boolean;
        }

        const buttonStyles = styleCollector<ButtonProps, {}, {}>('button')
            .element`
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
            `.modifier(props => !!props!.primary)`
                background-color: #f95b5b;
                box-shadow: inset 0 -4px #c54646;
                color: #ffffff;

                :hover {
                    background-color: #e45454;
                }

                :active {
                    background-color: #c54646;
                }
            `.modifier(props => !!props!.disabled)`
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

        const buttonSpanStyles = styleCollector('button-span').element`
                font-size: 20px;
            `;

        const Button: FC<ButtonProps> = props => {
            const buttonClassNames = useStyles<ButtonProps, {}, {}>(
                buttonStyles,
                props,
            );
            const buttonSpanClassNames = useStyles(buttonSpanStyles);

            return (
                <button className={buttonClassNames}>
                    <span className={buttonSpanClassNames}>
                        {props.children}
                    </span>
                </button>
            );
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
    .add('Modifiers and state', () => {
        interface ButtonState {
            isOn?: boolean;
        }

        const toggleStyles = styleCollector<{}, ButtonState, {}>('toggle')
            .element`
                background-color: #b3cde8;
                border-radius: 6px;
                border: none;
                box-shadow: inset 0 -4px #9fb8d1;
                color: white;
                display: inline-block;
                cursor: pointer;
                font: 500 20px sans-serif;
                letter-spacing: 1px;
                margin: 5px 10px;
                padding: 10px 20px 14px 20px;
                text-decoration: none;
                transition: all 300ms, color 300ms;
                outline: none;

                :hover {
                    background-color: #adc6e0;
                    color: rgba(255, 255, 255, 0.8);
                }

                :active {
                    background-color: #9fb8d1;
                }
            `.modifier((props, state) => !!state!.isOn)`
                background-color: #f95b5b;
                box-shadow: inset 0 -4px #c54646;
                color: #ffffff;

                :hover {
                    background-color: #e45454;
                }

                :active {
                    background-color: #c54646;
                }
            `;

        const Button: FC = () => {
            const [isOn, setToggle] = useState(false);
            const buttonClassNames = useStyles<{}, ButtonState, {}>(
                toggleStyles,
                {},
                { isOn },
            );

            return (
                <button
                    className={buttonClassNames}
                    onClick={() => setToggle(!isOn)}
                >
                    {!isOn ? <span>On</span> : <span>Off</span>}
                </button>
            );
        };

        return <Button />;
    })
    .add('Media queries', () => {
        const styles = styleCollector('ruler').element`
                background-color: #eaf2fd;
                padding: 20px;
                border: none;
                border-radius: 6px;
                color: #3b3b41;
                letter-spacing: 1px;
                font-family: sans-serif;
                font-weight: 400;
                text-align: center;

                &:before {
                    content: "Small";
                    display: block;
                    font-weight: 800;
                    font-size: 40px;
                    margin-bottom: 10px;
                }

                @media (min-width: 768px) {
                    &:before {
                        content: "Medium";
                    }

                    background-color: #deecff;
                }

                @media (min-width: 1000px) {
                    &:before {
                        content: "Large";
                    }

                    background-color: #c6cfff;
                }

                @media (min-width: 1500px) {
                    &:before {
                        content: "Extra Large";
                    }

                    background-color: #e8d3ff;
                }
            `;

        const ScreenRuler: FC = () => {
            const classNames = useStyles(styles);

            return <div className={classNames}>Resize me!</div>;
        };

        return <ScreenRuler />;
    })
    .add('Keyframe animations', () => {
        const styles = styleCollector('logo').element`
                width: 150px;
                height: auto;
                margin: 15px;
                padding: 15px;
                background-color: #f6e3e3;
                border-radius: 150px;
                animation: rotating 2s linear infinite;

                @keyframes rotating {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `;

        const TrousersLogo: FC = () => {
            const classNames = useStyles(styles);

            return (
                <img
                    className={classNames}
                    src="trousers-logo.png"
                    alt="Trousers Logo"
                />
            );
        };

        return <TrousersLogo />;
    });
