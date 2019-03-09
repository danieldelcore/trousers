import React, { FC, ComponentType } from 'react';

import { useTrousers, StyleCollector } from './';
import { getDisplayName } from './common';

const withTrousers = <Props, Theme>(
    Component: ComponentType<Props>,
    styleCollector: StyleCollector<Props, Theme>,
) => {
    const WrappedComponent: FC<Props> = props => {
        const displayName = getDisplayName(Component);
        const className = useTrousers<Props, Theme>(displayName, props, styleCollector);

        return <Component {...props} className={className} />;
    };

    return WrappedComponent;
};

export default withTrousers;
