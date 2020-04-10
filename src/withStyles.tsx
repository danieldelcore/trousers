import React, { FC } from 'react';

import { useStyles, StyleCollector } from './';

export interface WithStylesProps {
    className?: string;
}

const withStyles = <
    Props extends WithStylesProps = WithStylesProps,
    Theme = {}
>(
    Component: React.ComponentType<Props>,
    styleCollector: (props: Props) => StyleCollector<Theme>,
) => {
    const WrappedComponent: FC<Props> = props => {
        const className = useStyles(styleCollector(props));

        return <Component {...props} className={className} />;
    };

    WrappedComponent.displayName =
        Component.displayName || Component.name || 'Component';

    return WrappedComponent;
};

export default withStyles;
