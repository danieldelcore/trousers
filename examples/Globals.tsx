/** @jsx jsx */
import { storiesOf } from '@storybook/react';

import css from '@trousers/core';
import jsx from '@trousers/react';

storiesOf('Globals', module)
    .add('Global styles', () => {
        const globals = css('global-reset', {}).global({
            // @ts-ignore
            '*': {
                color: '#f95b5b',
            },
        });

        const styles = css('block', {
            backgroundColor: '#eaf2fd',
            color: 'blue',
            padding: '20px',
            border: 'none',
            borderRadius: '6px',
            letterSpacing: '1px',
            fontFamily: 'sans-serif',
            textAlign: 'center',
        });

        const TextBlock = () => (
            <div css={globals}>
                <div css={styles}>
                    <h2>Global Styles!</h2>
                    <p className="some-class">I should be red!</p>
                </div>
            </div>
        );

        return <TextBlock />;
    })
    .add('Global styles with theme', () => {
        const globals = css('themed-reset', {})
            .global({
                // @ts-ignore
                '*': {
                    color: 'var(--color)',
                },
            })
            .theme({
                color: '#ff5d9e',
            });

        const styles = css('block', {
            backgroundColor: '#eaf2fd',
            color: 'blue',
            padding: '20px',
            border: 'none',
            borderRadius: '6px',
            letterSpacing: '1px',
            fontFamily: 'sans-serif',
            textAlign: 'center',
        });

        const TextBlock = () => (
            <div css={globals}>
                <div css={styles}>
                    <h2>Global Styles!</h2>
                    <p className="some-class">I should be red!</p>
                </div>
            </div>
        );

        return <TextBlock />;
    });
