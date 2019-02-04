import { ComponentType } from 'react';

export function getDisplayName<P>({ displayName, name }: ComponentType<P>) {
    return displayName || name || 'Component';
}
