/* eslint-disable @typescript-eslint/no-empty-interface */
/** @jsx jsx */
import css from './css';
import jsx from './jsx';
import { render } from '@testing-library/react';

let mountMock = jest.fn();
jest.mock('@trousers/sheet', () => ({
    __esModule: true,
    default: () => ({
        mount: (...args: any[]) => mountMock(...args),
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
        const styles = css('element', { '.element-2313942302': 'color: red;' });
        // @ts-ignore runtime css prop has no types when consumed
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
        const styles = css('', {
            '.2313942302': 'color: red;',
        });
        // @ts-ignore runtime css prop has no types when consumed
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
            '.element-2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });

        // @ts-ignore runtime css prop has no types when consumed
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
            '.element-2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });

        const { getByTestId } = render(
            // @ts-ignore runtime css prop has no types when consumed
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
            '.element-2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });

        const { getByTestId } = render(
            // @ts-ignore runtime css prop has no types when consumed
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
            '.element-2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });

        const { getByTestId } = render(
            // @ts-ignore runtime css prop has no types when consumed
            <div css={styles} $primary={true} data-testid="test" />,
        );

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302 primary-2561700995"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'primary.primary-2561700995',
            '.primary-2561700995{color: blue;}',
            false,
        );
    });

    it('mounts modifier if prop is supplied with no value', () => {
        const styles = css('element', {
            '.element-2313942302': 'color: red;',
        }).modifier('primary', {
            '.primary-2561700995': 'color: blue;',
        });

        const { getByTestId } = render(
            // @ts-ignore runtime css prop has no types when consumed
            <div css={styles} $primary data-testid="test" />,
        );

        expect(getByTestId('test').className).toMatchInlineSnapshot(
            `"element-2313942302 primary-2561700995"`,
        );
        expect(mountMock).toHaveBeenCalledTimes(2);
        expect(mountMock).toHaveBeenCalledWith(
            'element.element-2313942302',
            '.element-2313942302{color: red;}',
            false,
        );
        expect(mountMock).toHaveBeenCalledWith(
            'primary.primary-2561700995',
            '.primary-2561700995{color: blue;}',
            false,
        );
    });

    it.todo('mounts multiple modifiers');
    it.todo('mounts element and modifier styles without id');
    it.todo('mounts themed elements');
    it.todo('mounts themed modifiers');
    it.todo('mounts themed globals');
    it.todo('mounts single global');
    it.todo('mounts multiple globals');
    it.todo('cleans-up globals on dismount');
});
