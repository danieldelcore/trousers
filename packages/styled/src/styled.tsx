/** @jsx jsx */
import { ComponentType, forwardRef } from 'react';
import jsx from '@trousers/react';
import { Collector } from '@trousers/core';
import { TrousersProps } from '@trousers/react';

type Elements = keyof JSX.IntrinsicElements;
const domElements: Elements[] = [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'base',
    'bdi',
    'bdo',
    'big',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'data',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'div',
    'dl',
    'dt',
    'em',
    'embed',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hgroup',
    'hr',
    'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'keygen',
    'label',
    'legend',
    'li',
    'link',
    'main',
    'map',
    'mark',
    'menu',
    'menuitem',
    'meta',
    'meter',
    'nav',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'param',
    'picture',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'small',
    'source',
    'span',
    'strong',
    'style',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'track',
    'u',
    'ul',
    'var',
    'video',
    'wbr',
    'circle',
    'clipPath',
    'defs',
    'ellipse',
    'foreignObject',
    'g',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'stop',
    'svg',
    'text',
    'tspan',
];

interface StyledProps
    extends JSX.IntrinsicAttributes,
        Omit<TrousersProps, 'css'> {}
type CollectorHOC = (css: ReturnType<Collector>) => ComponentType<StyledProps>;
type ElementMap = {
    [key in Elements]: CollectorHOC;
};

interface Styled extends ElementMap {
    (Tag: Elements): CollectorHOC;
}

let styledBase = (Tag: Elements) => (css: ReturnType<Collector>) =>
    forwardRef<HTMLElement, StyledProps>((props, ref) => {
        //@ts-ignore union type is too complex
        return <Tag css={css} {...props} ref={ref} />;
    });

const styled: Styled = Object.assign(
    styledBase,
    domElements.reduce<ElementMap>((accum, element) => {
        accum[element] = styledBase(element);
        return accum;
        // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    }, {} as ElementMap),
);

export default styled;
