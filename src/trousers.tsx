import React, { ComponentType, useContext } from 'react';

import {
    ClassNameRegistry,
    generateHash,
    getDisplayName,
    Predicate,
    registerStyle,
} from './common';

import {
    Theme,
    ThemeContext,
} from '../src';

function wrapComponent<Props>(
    Component: ComponentType<Props>,
    classNames: ClassNameRegistry,
) {
    const theme = useContext(ThemeContext);

    return (props: Props) => (
        <Component
            {...props}
            className={classNames.evaluate(props)}
        />
    );
}

export default function withTrousers<Props>(Component: ComponentType<Props>) {
    const componentName = getDisplayName(Component);
    const classNames = new ClassNameRegistry();

    const self = {
        block: (styles: TemplateStringsArray, ...expressions: any[]) => registerStyles(styles, expressions),
        modifier: (predicate: Predicate) => (styles: TemplateStringsArray, ...expressions: any[]) => registerStyles(styles, expressions, predicate),
        Component: wrapComponent(Component, classNames),
    };

    function registerStyles(
        styles: TemplateStringsArray,
        expressions: any[],
        predicate: Predicate = () => true,
    ) {
        const componentHash = generateHash();
        const className = `${componentName}-${componentHash}`;

        classNames.push(className, predicate);

        registerStyle<Theme>(`.${className}`, styles, expressions, {} /** theme */);

        return self;
    }

    return self;
}
