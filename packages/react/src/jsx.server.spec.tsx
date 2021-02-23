/** @jsx jsx */
import jsx from './jsx';
import { render } from '@testing-library/react';
import css from '@trousers/core';

jest.mock('@trousers/core', () => ({
    __esModule: true,
    ...(jest.requireActual('@trousers/core') as object),
    isBrowser: () => false,
}));

describe('jsx (ssr mode)', () => {
    it('renders element styles', () => {
        const styles = css('element', {
            color: 'red',
        });

        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders element styles without id', () => {
        const styles = css({
            color: 'red',
        });

        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"2313942302"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('does not render modifier if prop is not provided', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('does not render modifier if prop false', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { container, getByTestId } = render(
            <div css={styles} $primary={false} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('does not render modifier if prop undefined', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { container, getByTestId } = render(
            <div css={styles} $primary={undefined} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders element and modifier styles', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { container, getByTestId } = render(
            <div css={styles} $primary data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302 element-2313942302--primary-2561700995"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders element and modifier styles without id', () => {
        const styles = css({
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { container, getByTestId } = render(
            <div css={styles} $primary data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"2313942302 2313942302--primary-2561700995"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders themed elements', () => {
        const styles = css('element', {
            color: 'var(--primary-color)',
        }).theme({ primaryColor: 'red' });

        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-1937164027 theme-element-4276149098"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders themed modifiers', () => {
        const styles = css('element', {
            color: 'var(--primary-color)',
        })
            .modifier('secondary', {
                color: 'var(--secondary-color)',
            })
            .theme({
                primaryColor: 'red',
                secondaryColor: 'blue',
            });

        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-1937164027 theme-element-2013313543"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders themed globals', () => {
        const styles = css('element', {
            color: 'red',
        })
            .global({
                ':root': {
                    color: 'var(--color)',
                },
            })
            .theme({ color: 'red' });

        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302  theme-element-2313942302"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders single global', () => {
        const styles = css('element', {
            color: 'red',
        }).global({
            ':root': {
                boxSizing: 'border-box',
            },
        });

        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders multiple globals', () => {
        const styles = css('element', {})
            .global({
                ':root': {
                    boxSizing: 'border-box',
                },
            })
            .global({
                // @ts-ignore
                body: {
                    color: 'green',
                },
            });

        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-3938"`,
        );
        expect(container).toMatchSnapshot();
    });
});
