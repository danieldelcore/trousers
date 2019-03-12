import React, { createContext, FC, ReactNode } from 'react';

import { generateHash } from './common';

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

export const ThemeConumser = ThemeContext.Consumer;

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => {
    const key = JSON.stringify(theme);
    const hash = generateHash(key);

    return (
        <ThemeContext.Provider value={{ hash, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};
