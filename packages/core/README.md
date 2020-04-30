# @trousers/core

`@trousers/core` is the heart of the repo, it exists to act as the most minimal and light-weight version of Trousers, allowing you to opt-out of other features such as theming (@trousers/theme) and the bem-style style collectors(@trousers/collector).

## API 🤖

### `css`

A single style defintion

**Arugments:**

-   `taggedTemplate`: TaggedTemplate

**Example:**

```jsx
import { css } from 'trousers';

const styles = css`
    background-color: red;
`;
```

### `jsx`

```jsx
TODO;
```

### `useStyles()`

React Hook responsbile for evaluating the supplied styles, attaching them to the document head and returning all active classes for the current state.

**Arguments:**

-   `styleCollector`: StyleCollector
-   `props`?: Object
-   `state`?: Object

**Returns:**

-   `className`: string

**Example:**

```jsx
import React from 'react';
import { styleCollector, useStyles } from 'trousers';

const styles = props => styleCollector('button')
    .element``
    .modifier(...)``;

const Button = props => {
    const classNames = useStyles(styles(props));

    return (
        <button className={classNames}>
            Submit
        </button>
    );
};
```

### `withStyles`

A [HOC (Higher Order Component)](https://reactjs.org/docs/higher-order-components.html) which accepts a component and a style collector. Returns a new component, with the supplied styles rendered and passed down to via a `className` prop.

Use this HOC in your class components, where hooks (and useStyles) are not available.

> Note: Remember to apply the supplied className prop to an element in your components render funciton or your styling wont be applied to your element!

**Arguments:**

-   `Component`: React Component
-   `(props) => styleCollector`: Function returning a StyleCollector

**Example:**

```jsx
import React from 'react';
import { styleCollector, withStyles } from 'trousers';

class Button {
    render() {
        return (
            // IMPORTANT: apply the className yourself
            <button className={this.props.className}>
                Submit
            </button>
        )
    }
);

export default withStyles(Button, (props) => styleCollector('button')
    .element``
    .modifier(props.primary)``);
```

### `useGlobals()`

Mount a single style definition as a global style

**Arguments:**

-   `styleCollector`: SingleStyleCollector | SingleStyleCollector[]

**Returns**

-   void

**Example:**

```jsx
import React, { useEffect } from 'react';
import { css, useGlobals } from 'trousers';

const globalStyles = css`
  @font-face {
    font-family: MyFont;
    src: url('${MyFont}') format('opentype');
  }
`;

const App = () => {
    useGlobals(globalStyles);

    return <h1>Welcome to my website!</h1>;
};
```

`useGlobals` also accepts an array of styles...

```jsx
import React, { useEffect } from 'react';
import { css, useGlobals } from 'trousers';

const globalStyles = css`...`;
const moreGlobalStyles = css`...`;

const App = () => {
    useGlobals([globalStyles, moreGlobalStyles]);

    return <h1>Welcome to my website!</h1>;
};
```

### `withGlobals`

A [HOC (Higher Order Component)](https://reactjs.org/docs/higher-order-components.html) which accepts a component and a single style collector. Returns a new component, with the supplied global styles rendered to the document head.

Use this HOC in your class components, where hooks (and useGlobals) are not available.

**Arguments:**

-   `Component`: React Component
-   `css`: SingleStyleCollector

**Example:**

```jsx
import React from 'react';
import { css, withGlobals } from 'trousers';

class Button {
    render() {
        return (
            <button>
                Submit
            </button>
        )
    }
);

export default withGlobals(Button, css`
    * {
        box-sizing: border-box;
    }
`);
```
