import React, { createContext, FC, ReactNode } from 'react';

interface ThemeContext {
    theme: Record<string, any>;
}

export interface ThemeProviderProps extends ThemeContext {
    children: ReactNode;
}

export const ThemeContext = createContext<ThemeContext>({
    theme: {},
});

export const ThemeConumser = ThemeContext.Consumer;

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => {
    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
}
