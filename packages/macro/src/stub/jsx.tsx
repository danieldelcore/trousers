import '../runtime/global-types';
import { createElement, ElementType, ReactNode } from 'react';

import { TrousersProps } from '@trousers/core';

const jsx = <Props extends TrousersProps>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    ...children: ReactNode[]
) => createElement(type, props, ...children);

export default jsx;
