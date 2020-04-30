# @trousers/theme

`@trousers/theme` provides tools for theming your application.

Theming is achieved via React's Context API. Use the `ThemeProvider` to send your theme down the react tree and give all usages of `useStyles` and `useGlobals` access to your theme. You can even choose to nest themes and present a section of your app in a different way.

It looks a little something like this:

```jsx
import { ThemeProvider } from 'trousers';

const lightTheme = {
    primaryColor: 'white',
    secondaryColor: 'blue',
    disabledColor: 'grey',
};

const darkTheme = {
    primaryColor: 'black',
    secondaryColor: 'purple',
    disabledColor: 'grey',
};

const MyApp = () => {
    return (
        <ThemeProvider theme={lightTheme}>
            <h1>Hello World</h1>
            <p>Rest of my app lives here and has access to the light theme!</p>
            <ThemeProvider theme={darkTheme}>
                <p>This subtree will have access to the dark theme!</p>
            </ThemeProvider>
        </ThemeProvider>
    );
};
```

When a Trousers component is mounted within a new theme context, it will render new styles and apply them to the component.

You can define how your component handles themes like this:

```jsx
const buttonStyles = props => styleCollector('button').element`
        background-color: ${theme => theme.secondaryColor};
    `.modifier(props.primary)`
        background-color: ${theme => theme.primaryColor};
    `.modifier(props.disabled)`
        background-color: ${theme => theme.disabledColor};
    `;
```

Now your component will render different styles based on the context it is mounted in.

## API

### `<ThemeProvider />`

Responsible for pushing the supplied theme into React's Context API.

**Props:**

-   `theme`: Object

**Example:**

```jsx
import React from 'react';
import { ThemeProvider } from '@trousers/theme';

const theme = {
    primaryColor: 'red',
    secondaryColor: 'blue',
};

const App = () => (
    <ThemeProvider theme={theme}>
        {* Every child node will have access to the theme *}
    </ThemeProvider>
);
```

### `useTheme`

A handy utility hook which pulls the theme from context. Useful when you want to use the CSS prop with object notation.

```jsx
/** @jsx jsx */
import React from 'react';
import { jsx } from '@trousers/core';
import { ThemeProvider, useTheme } from '@trousers/theme';

const theme = {
    primaryColor: 'red',
    secondaryColor: 'blue',
};

const Foo = () => {
  const theme = useTheme();

  return (
    <div css={{
      color: theme.primaryColor;
    }}>
      Foo bar
    </div>
  );
}

const App = () => (
    <ThemeProvider theme={theme}>
      <Foo />
    </ThemeProvider>
);
```
