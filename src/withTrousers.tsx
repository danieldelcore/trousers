import React, { FC, ComponentType } from 'react';

import { useTrousers, StyleCollector } from './';

const withTrousers = <Props, State, Theme>(
    Component: ComponentType<Props>,
    styleCollector: StyleCollector<Props, State, Theme>,
) => {
    const WrappedComponent: FC<Props> = (props, state) => {
        const className = useTrousers<Props, State, Theme>(
            styleCollector,
            props,
            state,
        );

        return <Component {...props} className={className} />;
    };

    return WrappedComponent;
};

export default withTrousers;
