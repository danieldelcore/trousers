import React, { createContext, FC, ReactNode } from 'react';

import { ServerStyleRegistry } from './styles';

export interface ServerCtx {
    serverStyleRegistry?: ServerStyleRegistry;
}

export interface ServerProviderProps {
    registry: ServerStyleRegistry;
    children: ReactNode;
}

export const ServerContext = createContext<ServerCtx>({
    serverStyleRegistry: undefined,
});

export const ServerConumser = ServerContext.Consumer;

export const ServerProvider: FC<ServerProviderProps> = ({
    registry,
    children,
}) => (
    <ServerContext.Provider value={{ serverStyleRegistry: registry }}>
        {children}
    </ServerContext.Provider>
);
