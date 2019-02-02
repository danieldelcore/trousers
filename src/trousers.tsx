import React, {
  Component,
  ComponentType,
  createRef,
  RefObject,
} from 'react';
import stylis from 'stylis';

import interpolateStyles from './interpolate-styles';
import classNameGenerator from './classname-generator';
import getDisplayName from './get-display-name';

const withTrousers = <P extends object>(WrappedComponent: ComponentType<P>) =>
  (styles: string[], ...expressions: any[]) =>
    class extends Component<P> {
      elementRef: RefObject<HTMLElement>;

      constructor(props: P) {
        super(props);

        this.elementRef = createRef();
      }

      componentDidMount() {
        const componentName = getDisplayName(WrappedComponent);
        const selector = classNameGenerator(componentName);
        const rawStyles = interpolateStyles(styles, expressions, this.props);
        const processedStyles = stylis(selector, rawStyles);

        this.elementRef.current!.setAttribute('style', processedStyles);
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            ref={this.elementRef}
          />
        );
      }
    };

export default withTrousers;
