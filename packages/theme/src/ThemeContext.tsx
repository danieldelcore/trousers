import React, { createContext, FC, ReactNode } from 'react';

import { generateHash } from '@trousers/hash';

export interface ThemeCtx {
    hash: number;
    theme: Record<string, any>;
}

export interface ThemeProviderProps {
    theme: Record<string, any>;
    children: ReactNode;
}

export const ThemeContext = createContext<ThemeCtx>({
    hash: 0,
    theme: {},
});

export const ThemeConsumer = ThemeContext.Consumer;

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => {
    const key = JSON.stringify(theme);
    const hash = generateHash(key);
    const value = React.useMemo(
        () => ({
            hash,
            theme,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [hash],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
