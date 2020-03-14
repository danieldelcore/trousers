import React, { ReactNode, ReactChild } from 'react';
import stylis from 'stylis';

import { STYLE_ID, GLOBAL_STYLE_ID } from '../constants';
import RegistryInterface from './registry-interface';

class ServerRegistry implements RegistryInterface {
    private globals: Map<string, string> = new Map();
    private styles: Map<string, string> = new Map();

    register(id: string, styles: string, isGlobal?: boolean) {
        if (this.has(id)) return;

        const selector = !isGlobal ? id : ``;
        const processedStyles = stylis(selector, styles);

        if (!isGlobal) {
            this.styles.set(id, processedStyles);
        } else {
            this.globals.set(id, processedStyles);
        }
    }

    has(id: string): boolean {
        return this.styles.has(id);
    }

    get() {
        return [...this.renderGlobals(), ...this.renderStyles()];
    }

    clear() {}

    private renderStyles(): ReactNode {
        const ids: string[] = [];
        const styles: string[] = [];

        this.styles.forEach((value, key) => {
            ids.push(key);
            styles.push(value);
        });

        return (
            <style
                {...{
                    [STYLE_ID]: ids.toString(),
                }}
            >
                {styles.join('\n')}
            </style>
        );
    }

    private renderGlobals() {
        const styles: ReactChild[] = [];

        this.globals.forEach((value, key) => {
            styles.push(
                <style
                    {...{
                        [GLOBAL_STYLE_ID]: key,
                    }}
                >
                    {value}
                </style>,
            );
        });

        return styles;
    }
}

export default ServerRegistry;
