import React, {
  Component,
  ComponentType,
} from 'react';
import stylis from 'stylis';

import interpolateStyles from './interpolate-styles';
import classNameGenerator from './classname-generator';
import getDisplayName from './get-display-name';

function appendToHead(styles: string) {
  const css = document.createElement('style');
  css.setAttribute('data-trousers', '');
  css.type = 'text/css';
  css.appendChild(document.createTextNode(styles));
  document.getElementsByTagName("head")[0].appendChild(css);
}

const withTrousers = <P extends object>(WrappedComponent: ComponentType<P>) =>
  (styles: TemplateStringsArray, ...expressions: any[]) =>
    class extends Component<P> {
      componentDidMount() {
        const componentName = getDisplayName(WrappedComponent);
        const selector = classNameGenerator(componentName).toLowerCase();
        const rawStyles = interpolateStyles(styles, expressions, this.props);
        const processedStyles = stylis(selector, rawStyles);

        appendToHead(processedStyles);
      }

      render() {
        return (
          <WrappedComponent {...this.props} />
        );
      }
    };

export default withTrousers;
