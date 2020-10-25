/** @jsx jsx */
import { storiesOf } from '@storybook/react';
import { FC, Fragment, ReactNode, useState } from 'react';

import css from '@trousers/core';
import jsx from '@trousers/react';

storiesOf('Basic', module)
    .add('Elements and modifiers', () => {
        interface ButtonProps {
            children: ReactNode;
            primary?: boolean;
            disabled?: boolean;
        }

        const buttonStyles = css('button', {
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
            '&:hover': {
                backgroundColor: '#adc6e0',
                color: 'rgba(255, 255, 255, 0.8)',
            },
            '&:active': {
                backgroundColor: '#9fb8d1',
            },
        })
            .modifier('primary', {
                backgroundColor: '#f95b5b',
                boxShadow: 'inset 0 -4px #c54646',
                color: '#ffffff',
                '&:hover': {
                    backgroundColor: '#e45454',
                },
                '&:active': {
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
            });

        const Button: FC<ButtonProps> = props => (
            <button css={buttonStyles}>{props.children}</button>
        );

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
        const toggleStyles = css('button', {
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
        }).modifier('isOn', {
            backgroundColor: '#f95b5b',
            boxShadow: 'inset 0 -4px #c54646',
            color: '#ffffff',

            '&:hover': {
                backgroundColor: '#e45454',
            },
            '&:active': {
                backgroundColor: '#c54646',
            },
        });

        const Button: FC = () => {
            const [isOn, setToggle] = useState(false);

            return (
                <button
                    css={toggleStyles}
                    onClick={() => setToggle(!isOn)}
                    isOn={isOn}
                >
                    <span>{!isOn ? 'On' : 'Off'}</span>
                </button>
            );
        };

        return <Button />;
    })
    .add('Media queries', () => {
        const styles = css('ruler', {
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
            // @ts-ignore
            '@media (min-width: 768px)': {
                '&:before': {
                    content: 'Medium',
                },
                backgroundColor: '#deecff',
            },
            '@media (min-width: 1000px)': {
                '&:before': {
                    content: 'Large',
                },
                backgroundColor: '#c6cfff',
            },
            '@media (min-width: 1500px)': {
                '&:before': {
                    content: 'Extra Large',
                },
                backgroundColor: '#e8d3ff',
            },
        });

        const ScreenRuler: FC = () => <div css={styles}>Resize me!</div>;

        return <ScreenRuler />;
    })
    .add('Keyframe animations', () => {
        const styles = css('logo', {
            width: '150px',
            height: 'auto',
            margin: '15px',
            padding: '15px',
            backgroundColor: '#f6e3e3',
            borderRadius: '150px',
            animation: 'rotating 2s linear infinite',
            // @ts-ignore
            '@keyframes rotating': {
                from: {
                    transform: 'rotate(0deg)',
                },
                to: {
                    transform: 'rotate(360deg)',
                },
            },
        });

        const TrousersLogo = () => (
            <img css={styles} src="trousers-logo.png" alt="Trousers Logo" />
        );

        return <TrousersLogo />;
    });
