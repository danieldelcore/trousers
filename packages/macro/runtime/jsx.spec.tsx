/** @jsx jsx */
import css from './css';
import jsx from './jsx';
import { render } from '@testing-library/react';

let mountMock = jest.fn();
jest.mock('@trousers/sheet', () => ({
    __esModule: true,
    default: () => ({
        // @ts-ignore
        mount: (...args) => mountMock(...args),
        has: () => false,
    }),
}));

// HACK: We need to remove this
// TODO: Figure out why useLayoutEffect doesn't work
jest.mock('react', () => ({
    __esModule: true,
    ...(jest.requireActual('react') as object),
    useLayoutEffect: (callback: any) => callback(),
}));

describe('jsx', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('mounts element styles', () => {
        const styles = css('element', {
            color: 'red',
        });

        const { getByTestId } = render(<div css={styles} data-testid="test" />);

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
    });

    it('mounts element styles without id', () => {
        const styles = css({
            color: 'red',
        });

        const { getByTestId } = render(<div css={styles} data-testid="test" />);

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"2313942302"`,
        );
        expect(mountMock).toHaveBeenCalledWith(
            '.2313942302',
            '.2313942302{color: red;}',
            false,
        );
    });

    it('does not mount modifier if prop is not provided', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { getByTestId } = render(<div css={styles} data-testid="test" />);

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );

        expect(mountMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
    });

    it('does not mount modifier if prop false', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { getByTestId } = render(
            <div css={styles} $primary={false} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
    });

    it('does not mount modifier if prop undefined', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { getByTestId } = render(
            <div css={styles} $primary={undefined} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(1);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
    });

    it('mounts modifier if prop is true', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { getByTestId } = render(
            <div css={styles} $primary={true} data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302 element-2313942302--primary-2561700995"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'primary.element-2313942302--primary-2561700995',
            '.element-2313942302--primary-2561700995{color: blue;}',
            false,
        );
    });

    it('mounts modifier if prop is supplied with no value', () => {
        const styles = css('element', {
            color: 'red',
        }).modifier('primary', { color: 'blue' });

        const { getByTestId } = render(
            <div css={styles} $primary data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302 element-2313942302--primary-2561700995"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'primary.element-2313942302--primary-2561700995',
            '.element-2313942302--primary-2561700995{color: blue;}',
            false,
        );
    });

    it('mounts multiple modifiers', () => {
        const styles = css('element', {
            color: 'red',
        })
            .modifier('primary', { color: 'blue' })
            .modifier('secondary', { color: 'green' });

        const { getByTestId } = render(
            <div css={styles} $primary $secondary data-testid="test" />,
        );
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302 element-2313942302--primary-2561700995 element-2313942302--secondary-2402939536"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(3);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'primary.element-2313942302--primary-2561700995',
            '.element-2313942302--primary-2561700995{color: blue;}',
            false,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'secondary.element-2313942302--secondary-2402939536',
            '.element-2313942302--secondary-2402939536{color: green;}',
            false,
        );
    });

    it('mounts element and modifier styles without id', () => {
        const styles = css({
            color: 'red',
        }).modifier('primary', {
            color: 'blue',
        });

        const { getByTestId, rerender } = render(
            <div css={styles} data-testid="test" />,
        );

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"2313942302"`,
        );
        expect(mountMock).toHaveBeenCalledWith(
            '.2313942302',
            '.2313942302{color: red;}',
            false,
        );
        expect(mountMock).toHaveBeenCalledTimes(1);

        rerender(<div css={styles} $primary data-testid="test" />);

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"2313942302 2313942302--primary-2561700995"`,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'primary.2313942302--primary-2561700995',
            '.2313942302--primary-2561700995{color: blue;}',
            false,
        );
    });

    it('mounts themed elements', () => {
        const styles = css('element', {
            color: 'var(--primary-color)',
        }).theme({ primaryColor: 'red' });

        const { getByTestId } = render(<div css={styles} data-testid="test" />);
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-1937164027 theme-element-4276149098"`,
        );

        expect(mountMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-1937164027',
            '.element-1937164027{color: var(--primary-color);}',
            false,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'theme-element-4276149098.theme-element-4276149098',
            '.theme-element-4276149098{--primary-color: red;}',
            false,
        );
    });

    it('mounts themed modifiers', () => {
        const styles = css('element', {
            color: 'var(--primary-color)',
        })
            .modifier('secondary', {
                color: 'var(--secondary-color)',
            })
            .theme({ primaryColor: 'red', secondaryColor: 'blue' });

        const { rerender, getByTestId } = render(
            <div css={styles} data-testid="test" />,
        );

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-1937164027 theme-element-2013313543"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-1937164027',
            '.element-1937164027{color: var(--primary-color);}',
            false,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'theme-element-2013313543.theme-element-2013313543',
            '.theme-element-2013313543{--primary-color: red;--secondary-color: blue;}',
            false,
        );

        rerender(<div css={styles} $secondary data-testid="test" />);

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-1937164027 element-1937164027--secondary-4258827273 theme-element-2013313543"`,
        );
    });

    it('mounts themed globals', () => {
        const styles = css('element', {
            color: 'red',
        })
            .global({
                ':root': {
                    color: 'var(--color)',
                },
            })
            .theme({ color: 'red' });

        const { getByTestId } = render(<div css={styles} data-testid="test" />);

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302  theme-element-2313942302"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(3);
        expect(mountMock).toHaveBeenCalledWith(
            'global-element-1166090240:root',
            ':root{color: var(--color);}',
            true,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'theme-element-2313942302.theme-element-2313942302',
            '.theme-element-2313942302{--color: red;}',
            false,
        );
    });

    it('mounts single global', () => {
        const styles = css('element', {
            color: 'red',
        }).global({
            ':root': {
                boxSizing: 'border-box',
            },
        });

        const { getByTestId } = render(<div css={styles} data-testid="test" />);
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledWith(
            'global-element-694683171:root',
            ':root{box-sizing: border-box;}',
            true,
        );
    });

    it('mounts multiple globals', () => {
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

        const { getByTestId } = render(<div css={styles} data-testid="test" />);
        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-3938"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledWith(
            'global-element-694683171:root',
            ':root{box-sizing: border-box;}',
            true,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'global-element-1251294446 body',
            ' body{color: green;}',
            true,
        );
    });

    it.todo('cleans-up globals on dismount');
});
