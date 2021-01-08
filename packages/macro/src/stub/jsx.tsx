/** TODO: this stub might be redundant because the global types should be enough in dev mode */
/** IDEA: Maybe just re-export the react JSX module here. The code will never be run so who cares right? Also global types come for freee */
import { createElement, ElementType, ReactNode } from 'react';

import { TrousersProps } from '@trousers/react';

const jsx = <Props extends TrousersProps>(
    type: ElementType<Omit<Props, 'css'>>,
    props: Props,
    ...children: ReactNode[]
) => createElement(type, props, ...children);

export default jsx;
