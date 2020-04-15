import React, { FC, ComponentType } from 'react';

import { CSSProps, StyleCollector } from '@trousers/utils';
import useGlobals from './useGlobals';

const withGlobal = <Props, Theme>(
    Component: ComponentType<Props>,
    styleCollectors:
        | StyleCollector<Theme>
        | StyleCollector<Theme>[]
        | CSSProps
        | CSSProps[],
) => {
    const WrappedComponent: FC<Props> = props => {
        useGlobals<Theme>(styleCollectors);

        return <Component {...props} />;
    };

    WrappedComponent.displayName = Component.displayName || Component.name;

    return WrappedComponent;
};

export default withGlobal;
