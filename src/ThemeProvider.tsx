import { ReactNode } from 'react';

import { TaggedTemplate } from './types';

type Theme = Record<string, any>; // Pass in theme typings as a generic

interface ThemeProviderProps {
    children: ReactNode;
    theme: Record<string, any>;
    globals: (theme: Theme) => TaggedTemplate;
}

const ThemeProvider = ({ children, theme, globals }: ThemeProviderProps) => {

}
