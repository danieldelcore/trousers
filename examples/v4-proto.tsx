/** @jsx jsx */
import { ReactNode, Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import { jsx, css, createTheme } from '@trousers/core';

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

storiesOf('v4', module).add('Default', () => (
    <Fragment>
        <Button>Themed Button!</Button>
        <Button primary>Primary Themed Button!</Button>
    </Fragment>
));
