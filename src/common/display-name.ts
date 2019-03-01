import { ComponentType } from 'react';

function getDisplayName<Props>({ displayName, name }: ComponentType<Props>) {
    return displayName || name || 'Component';
}

export default getDisplayName;
