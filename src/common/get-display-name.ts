import { ComponentType } from 'react';

export default function getDisplayName<P>({ displayName, name }: ComponentType<P>) {
    return displayName || name || 'Component';
}
