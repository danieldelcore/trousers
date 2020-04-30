import React, { createContext, FC, ReactNode } from 'react';

import { ServerRegistry } from './registry';

export type ServerCtx = ServerRegistry | undefined;

export interface ServerProviderProps {
    registry: ServerRegistry;
    children: ReactNode;
}

export const ServerContext = createContext<ServerCtx>(undefined);

export const ServerConsumer = ServerContext.Consumer;

export const ServerProvider: FC<ServerProviderProps> = ({
    registry,
    children,
}) => (
    <ServerContext.Provider value={registry}>{children}</ServerContext.Provider>
);
