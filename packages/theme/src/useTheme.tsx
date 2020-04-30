import { useContext } from 'react';
import { ThemeCtx, ThemeContext } from './ThemeContext';

const useTheme = () => {
    const themeCtx = useContext<ThemeCtx>(ThemeContext);

    return themeCtx;
};

export default useTheme;
