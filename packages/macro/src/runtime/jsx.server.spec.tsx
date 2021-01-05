/** @jsx jsx */
import css from './css';
import jsx from './jsx';
import { render } from '@testing-library/react';

jest.mock('@trousers/core', () => ({
    __esModule: true,
    ...(jest.requireActual('@trousers/core') as object),
    isBrowser: () => false,
}));

describe('jsx (ssr mode)', () => {
    it('renders element styles', () => {
        const styles = css('element', { '.element-2313942302': 'color: red;' });
        const { container, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders element styles without id', () => {
        const styles = css('', { '.2313942302': 'color: red;' });
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
            '.element-2313942302': 'color: red;',
        }).modifier('primary', { '.primary-2561700995': 'color: blue;' });

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
            '.element-2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });

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
            '.element-2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });

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
            '.element-2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });

        const { container, getByTestId } = render(
            <div css={styles} $primary data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302 primary-2561700995"`,
        );
        expect(container).toMatchSnapshot();
    });

    it('renders element and modifier styles without id', () => {
        const styles = css('element', {
            '.2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });
        const { container, getByTestId } = render(
            <div css={styles} $primary data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"2313942302 primary-2561700995"`,
        );
        expect(container).toMatchSnapshot();
    });
});
