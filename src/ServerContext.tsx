import React, { createContext, FC, ReactNode } from 'react';

import { ServerStyleRegistry } from './styles';

export type ServerCtx = ServerStyleRegistry | undefined;

export interface ServerProviderProps {
    registry: ServerStyleRegistry;
    children: ReactNode;
}

export const ServerContext = createContext<ServerCtx>(undefined);

export const ServerConumser = ServerContext.Consumer;

export const ServerProvider: FC<ServerProviderProps> = ({
    registry,
    children,
}) => (
    <ServerContext.Provider value={registry}>{children}</ServerContext.Provider>
);
