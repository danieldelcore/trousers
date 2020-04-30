import React, { createContext, FC, ReactNode } from 'react';

import { toHash } from '@trousers/hash';

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
    const hash = toHash(JSON.stringify(theme));
    const { theme: cachedTheme } = React.useMemo(
        () => ({
            theme,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [hash],
    );

    return (
        <ThemeContext.Provider value={{ theme: cachedTheme, hash }}>
            {children}
        </ThemeContext.Provider>
    );
};
