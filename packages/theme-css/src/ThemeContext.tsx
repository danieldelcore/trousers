import React, { FC } from 'react';

import { toHash } from '@trousers/hash';
import { ThemeProviderProps, ThemeContext } from '@trousers/theme';

function buildTheme(theme: Record<string, any>, prefix: string = '') {
    return Object.keys(theme).reduce<Record<string, any>>(
        (accum, key) => {
            if (typeof theme[key] === 'object') {
                const { vars, values } = buildTheme(theme[key], key);
                accum = {
                    vars: { ...accum.vars, ...vars },
                    values: { ...accum.values, ...values },
                };
            } else {
                accum.values[key] = `var(--${prefix}${key})`;
                accum.vars[`--${prefix}${key}`] = theme[key];
            }

            return accum;
        },
        {
            values: {},
            vars: {},
        },
    );
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => {
    const hash = toHash(JSON.stringify(theme));
    const { values, vars } = React.useMemo(() => buildTheme(theme), [theme]);

    return (
        <ThemeContext.Provider value={{ hash, theme: values }}>
            <div style={vars}>{children}</div>
        </ThemeContext.Provider>
    );
};
