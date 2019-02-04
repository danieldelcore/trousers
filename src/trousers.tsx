import React, { ComponentType } from 'react';

import {
  registerStyle,
  generateHash,
  getDisplayName,
  ClassNameRegistry,
  Predicate,
} from './common';

type Theme = Record<string, any>;

const theme: Theme = {
  primaryColor: 'red',
};

function wrapComponent<Props>(
  Component: ComponentType<Props>,
  classNames: ClassNameRegistry,
) {
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
    block: (styles: TemplateStringsArray, ...expressions: any[]) => registerStyles(() => true, styles, expressions),
    modifier: (predicate: Predicate) => (styles: TemplateStringsArray, ...expressions: any[]) => registerStyles(predicate, styles, expressions),
    Component: wrapComponent(Component, classNames),
  };

  function registerStyles(
    predicate: Predicate,
    styles: TemplateStringsArray,
    ...expressions: any[]
  ) {
    const componentHash = generateHash();
    const className = `${componentName}-${componentHash}`;

    classNames.push(className, predicate);

    registerStyle<Theme>(`.${className}`, styles, expressions, theme);

    return self;
  }

  return self;
}
