import React, { FC, ComponentType } from 'react';

import { useGlobals, SingleStyleCollector } from './';

const withGlobal = <Props, Theme>(
    Component: ComponentType<Props>,
    styleCollectors:
        | SingleStyleCollector<Theme>
        | SingleStyleCollector<Theme>[],
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
