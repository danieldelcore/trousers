/** @jsx jsx */
import {
    createElement,
    hasOwnProperty,
    ElementType,
    ReactNode,
    CSSProperties,
    useLayoutEffect,
    Fragment,
} from 'react';

import './temp';

interface Definition {
    id: string;
    className: string;
    styles: CSSProperties;
}

function Sheet() {
    return {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        has: (className: string) => true,
        mount: ({ id, className, styles }: Definition) => {
            console.log('Mounting', id, className, styles);
        },
        clear: () => undefined,
    };
}

const sheet = Sheet();

function hash(str: string) {
    let hash = 0;

    if (str.length == 0) return hash;

    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return hash >>> 0;
}

function css(elementId: string, styles: CSSProperties) {
    const styleMap: Definition[] = [
        {
            id: elementId,
            className: `${elementId}-${JSON.stringify(hash)}`,
            styles,
        },
    ];

    const self = {
        _get: () => styleMap,
        modifier: (id: string, styles: CSSProperties) => {
            styleMap.push({
                id,
                className: `.${id}-${JSON.stringify(hash)}`,
                styles,
            });

            return self;
        },
    };

    return self;
}

export type Collector = typeof css;

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createTheme(theme: Record<string, any>) {}

const jsx = <
    Props extends { css: ReturnType<Collector>; primary?: boolean; theme?: any }
>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    // props: Props,
    ...children: ReactNode[]
) => {
    if (props == null || !hasOwnProperty.call(props, 'css')) {
        return createElement(type, props, ...children);
    }

    const { css, ...rest } = props;
    const definitions = css
        ._get()
        .filter(
            ({ id, className }) =>
                !!(props as any)[id] || !sheet.has(className),
        );
    const className = definitions
        .map(({ id }) => id)
        .join(' ')
        .trim();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
        // const headElement = document.getElementsByTagName('head')[0];

        definitions.forEach(sheet.mount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [className]);

    return createElement(type, { ...rest, className }, ...children);
};

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

const Button = (props: ButtonProps) => {
    return (
        <button css={styles} primary={props.primary} theme={theme}>
            {props.children}
        </button>
    );
};

// export default Button;

import { storiesOf } from '@storybook/react';

storiesOf('v4', module).add('Default', () => {
    return (
        <Fragment>
            <Button>Themed Button!</Button>
            <Button primary>Primary Themed Button!</Button>
        </Fragment>
    );
});
