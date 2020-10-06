/** @jsx jsx */
import { ReactNode, Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import { jsx, css, createTheme, styled } from '@trousers/core';

//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const theme = createTheme({
    default: 'blue',
    primary: 'red',
});

const styles = css('button', {
    backgroundColor: 'var(--theme-default)',
    color: 'red',
}).modifier('primary', {
    backgroundColor: 'var(--theme-primary)',
    color: 'blue',
});

interface ButtonProps {
    primary?: boolean;
    children: ReactNode;
}

const Button = ({ primary, children }: ButtonProps) => (
    <button css={styles} theme={theme} primary={primary}>
        {children}
    </button>
);

const StyledButton = styled.button(styles);
const StyledButtonAlt = styled('button')(styles);

storiesOf('v4', module)
    .add('Default', () => (
        <Fragment>
            <Button>Themed Button!</Button>
            <Button primary>Primary Themed Button!</Button>
        </Fragment>
    ))
    .add('Styled', () => (
        <Fragment>
            <StyledButton> Styled, Themed Button!</StyledButton>
            <StyledButton primary>Styled, Primary Themed Button!</StyledButton>
            <StyledButtonAlt> Styled, Themed Button!</StyledButtonAlt>
            <StyledButtonAlt primary>
                Styled, Primary Themed Button!
            </StyledButtonAlt>
        </Fragment>
    ));
