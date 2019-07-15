import React, { FC, ComponentType } from 'react';

import { useGlobal, SingleStyleCollector } from './';

const withGlobal = <Props, Theme>(
    Component: ComponentType<Props>,
    styleCollectors:
        | SingleStyleCollector<Theme>
        | SingleStyleCollector<Theme>[],
) => {
    const WrappedComponent: FC<Props> = props => {
        useGlobal<Theme>(styleCollectors);

        return <Component {...props} />;
    };

    return WrappedComponent;
};

export default withGlobal;
