import React, { ReactNode, ReactChild, Fragment } from 'react';
import stylis from 'stylis';

import StyleRegistryInterface from './style-registry-interface';

class ServerRegistry implements StyleRegistryInterface {
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

    get(): ReactNode {
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
            <style data-trousers={ids.toString()}>{styles.join('\n')}</style>
        );
    }

    private renderGlobals(): ReactNode {
        const styles: ReactChild[] = [];

        this.globals.forEach((value, key) => {
            styles.push(<style data-trousers-global={key}>{value}</style>);
        });

        return styles;
    }
}

export default ServerRegistry;
