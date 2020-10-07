/** @jsx jsx */
import { ReactNode, Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import { jsx, css, styled } from '@trousers/core';

const styles = css('button', {
    backgroundColor: 'var(--default)',
    color: 'red',
})
    .modifier('primary', {
        backgroundColor: 'var(--primary)',
        color: 'blue',
    })
    .theme({ default: 'blue', primary: 'red' });

interface ButtonProps {
    primary?: boolean;
    children: ReactNode;
}

const Button = ({ primary, children }: ButtonProps) => (
    <button css={styles} primary={primary}>
        {children}
    </button>
);

const StyledButton = styled.button(styles);
const StyledButtonAlt = styled('button')(styles);

storiesOf('v4', module).add('Default', () => (
    <Fragment>
        <Button>Themed Button!</Button>
        <Button primary>Primary Themed Button!</Button>
        <StyledButton>Styled, Themed Button!</StyledButton>
        <StyledButton primary>Styled, Primary Themed Button!</StyledButton>
        <StyledButtonAlt>Styled, Themed Button!</StyledButtonAlt>
        <StyledButtonAlt primary>
            Styled, Primary Themed Button!
        </StyledButtonAlt>
    </Fragment>
));
