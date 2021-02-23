/** @jsx jsx */
import { FC, Fragment, ReactNode, useState } from 'react';
import { storiesOf } from '@storybook/react';

import css from '@trousers/core';
import jsx from '@trousers/react';
import styled from '@trousers/styled';

storiesOf('Styled', module)
    .add('Elements and modifiers', () => {
        interface ButtonProps {
            children: ReactNode;
            primary?: boolean;
            disabled?: boolean;
        }

        const Button = styled.button(
            css('button', {
                backgroundColor: '#b3cde8',
                borderRadius: '6px',
                border: 'none',
                boxShadow: 'inset 0 -4px #9fb8d1',
                color: 'white',
                display: 'inline-block',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontWeight: 'normal',
                fontSize: '20px',
                letterSpacing: '1px',
                margin: '5px 10px',
                padding: '10px 20px 14px 20px',
                textDecoration: 'none',
                transition: 'background-color 300ms, color 300ms',
                outline: 'none',
                ':hover': {
                    backgroundColor: '#adc6e0',
                    color: 'rgba(255, 255, 255, 0.8)',
                },
                ':active': {
                    backgroundColor: '#9fb8d1',
                },
            })
                .modifier('primary', {
                    backgroundColor: '#f95b5b',
                    boxShadow: 'inset 0 -4px #c54646',
                    color: '#ffffff',
                    ':hover': {
                        backgroundColor: '#e45454',
                    },
                    ':active': {
                        backgroundColor: '#c54646',
                    },
                })
                .modifier('disabled', {
                    backgroundColor: '#efefef',
                    boxShadow: 'inset 0 -4px #afafaf',
                    color: '#afafaf',
                    cursor: 'not-allowed',
                    '&:hover,&:active': {
                        color: '#afafaf',
                        backgroundColor: '#efefef',
                    },
                }),
        );

        return (
            <Fragment>
                <Button>Base</Button>
                <Button $primary>Primary</Button>
                <Button $disabled>Disabled</Button>
                <Button $primary $disabled>
                    Disabled Primary
                </Button>
            </Fragment>
        );
    })
    .add('Modifiers and state', () => {
        const ToggleButton = styled.button(
            css('button', {
                backgroundColor: '#b3cde8',
                borderRadius: '6px',
                border: 'none',
                boxShadow: 'inset 0 -4px #9fb8d1',
                color: 'white',
                display: 'inline-block',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontWeight: 'normal',
                fontSize: '20px',
                letterSpacing: '1px',
                margin: '5px 10px',
                padding: '10px 20px 14px 20px',
                textDecoration: 'none',
                outline: 'none',
                ':hover': {
                    backgroundColor: '#adc6e0',
                    color: 'rgba(255, 255, 255, 0.8)',
                },
                ':active': {
                    backgroundColor: '#9fb8d1',
                },
            }).modifier('isOn', {
                backgroundColor: '#f95b5b',
                boxShadow: 'inset 0 -4px #c54646',
                color: '#ffffff',
                ':hover': {
                    backgroundColor: '#e45454',
                },
                ':active': {
                    backgroundColor: '#c54646',
                },
            }),
        );

        const Button: FC = () => {
            const [isOn, setToggle] = useState(false);

            return (
                <ToggleButton onClick={() => setToggle(!isOn)} $isOn={isOn}>
                    <span>{!isOn ? 'On' : 'Off'}</span>
                </ToggleButton>
            );
        };

        return <Button />;
    })
    .add('Media queries', () => {
        const ScreenRuler = styled.div(
            css('ruler', {
                backgroundColor: '#eaf2fd',
                padding: '20px',
                border: 'none',
                borderRadius: '6px',
                color: '#3b3b41',
                letterSpacing: '1px',
                fontFamily: 'sans-serif',
                fontWeight: 'normal',
                textAlign: 'center',
                ':before': {
                    content: 'Small',
                    display: 'block',
                    fontWeight: 'bold',
                    fontSize: '40px',
                    marginBottom: '10px',
                },
                '@media (min-width: 768px)': {
                    '&:before': {
                        content: 'Medium',
                    },
                    backgroundColor: '#aac8f2',
                },
                '@media (min-width: 1000px)': {
                    '&:before': {
                        content: 'Large',
                    },
                    backgroundColor: '#bb99f0',
                },
                '@media (min-width: 1500px)': {
                    '&:before': {
                        content: 'Extra Large',
                    },
                    backgroundColor: '#9056ce',
                },
            }),
        );

        return <ScreenRuler>Resize me!</ScreenRuler>;
    })
    .add('Keyframe animations', () => {
        const Logo = styled.img(
            css('logo', {
                width: '150px',
                height: 'auto',
                margin: '15px',
                padding: '15px',
                backgroundColor: '#f6e3e3',
                borderRadius: '150px',
                animation: 'rotating 2s linear infinite',
                '@keyframes rotating': {
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: 'rotate(360deg)',
                    },
                },
            }),
        );

        return <Logo src="trousers-logo.png" alt="Trousers Logo" />;
    });
