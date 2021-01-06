# @trousers/react

`@trousers/react` is a Trousers implementation specifically for React.

## Installation

`yarn add @trousers/react` or `npm install @trousers/react`

## API

### `jsx`

This package exports a custom `jsx` pragma which can be used to enable the CSS prop.

-   The pragma allows for HTML elements to accept a `css` prop and modifier props, denoted by the `$` symbol.
-   The pragma contains logic for mounting and processing the styles for use with React
-   Modifiers accept a boolean value. Under the hood will toggle the relevant styles on or off accordingly. (if supplied by the styles passed into the css prop).

**Example: Basic usage**

```jsx
/** @jsx jsx */
import css from '@trousers/core';
import jsx from '@trousers/react';

const styles = css('button', { backgroundColor: 'red' }).modifier('primary', {
    backgroundColor: 'blue',
});

const Button = ({ primary }) => <button css={styles} $primary={primary} />;
```
