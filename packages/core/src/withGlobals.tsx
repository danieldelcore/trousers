import React, { FC, ComponentType } from 'react';

import { StyleCollector } from '@trousers/utils';
import useGlobals from './useGlobals';

const withGlobal = <Props, Theme>(
    Component: ComponentType<Props>,
    styleCollectors: StyleCollector<Theme> | StyleCollector<Theme>[],
) => {
    const WrappedComponent: FC<Props> = props => {
        useGlobals<Theme>(styleCollectors);

        return <Component {...props} />;
    };

    WrappedComponent.displayName =
        Component.displayName || Component.name || 'Component';

    return WrappedComponent;
};

export default withGlobal;
