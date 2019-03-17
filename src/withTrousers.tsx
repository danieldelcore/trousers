import React, { FC, ComponentType } from 'react';

import { useTrousers, StyleCollector } from './';

const withTrousers = <Props, Theme>(
    Component: ComponentType<Props>,
    styleCollector: StyleCollector<Props, Theme>,
) => {
    const WrappedComponent: FC<Props> = props => {
        const className = useTrousers<Props, Theme>(props, styleCollector);

        return <Component {...props} className={className} />;
    };

    return WrappedComponent;
};

export default withTrousers;
