import React, {
  Component,
  ComponentType,
} from 'react';
import stylis from 'stylis';

import interpolateStyles from './interpolate-styles';
import classNameGenerator from './classname-generator';
import getDisplayName from './get-display-name';
import { appendToHead } from './style-registry';

// TODO: move me to the theme provider
const tempTheme = {
  primaryColor: 'turquoise',
}

interface TrousersState {
  className: string;
}

const withTrousers = <P extends object>(WrappedComponent: ComponentType<P>) =>
  (styles: TemplateStringsArray, ...expressions: any[]) =>
    class extends Component<P, TrousersState> {
      state: TrousersState = {
        className: '',
      };

      componentDidMount() {
        const componentName = getDisplayName(WrappedComponent);
        const selector = classNameGenerator(componentName);
        const rawStyles = interpolateStyles<P>(styles, expressions, tempTheme, this.props);
        const processedStyles = stylis(selector, rawStyles);

        appendToHead(processedStyles);

        this.setState({
          className: selector.replace('.', ''),
        });
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            className={this.state.className}
          />
        );
      }
    };

export default withTrousers;
