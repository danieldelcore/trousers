import { ComponentType } from 'react';

function getDisplayName<P>({ displayName, name }: ComponentType<P>) {
    return displayName || name || 'Component';
}

export default getDisplayName;
