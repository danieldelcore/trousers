import React, { FC, ComponentType } from 'react';

import { useStyles, StyleCollector } from './';

const withStyles = <Props, State, Theme>(
    Component: ComponentType<Props>,
    styleCollector: StyleCollector<Props, State, Theme>,
) => {
    const WrappedComponent: FC<Props> = (props, state) => {
        const className = useStyles<Props, State, Theme>(
            styleCollector,
            props,
            state,
        );

        return <Component {...props} className={className} />;
    };

    return WrappedComponent;
};

export default withStyles;
