<p align="center">
  <img width="300" height="300" src="assets/trousers-logo.png" alt="Trousers, a little library for CSS-in-JS, without the mess">
</p>

# Trousers 👖

[![Financial Contributors on Open Collective](https://opencollective.com/trousers/all/badge.svg?label=financial+contributors)](https://opencollective.com/trousers) [![min](https://img.shields.io/bundlephobia/min/trousers.svg)](https://www.npmjs.com/package/trousers)
[![npm](https://img.shields.io/npm/v/trousers.svg)](https://www.npmjs.com/package/trousers)
[![Downloads per month](https://img.shields.io/npm/dm/trousers.svg)](https://www.npmjs.com/package/trousers)

React components are more stylish with Trousers!

[Try it here](https://danieldelcore.github.io/trousers/)

Trousers is a [hooks-first](https://reactjs.org/docs/hooks-overview.html) CSS-in-JS library, designed to help developers author React apps with performant and semantic CSS. It is heavily influenced by the conventions introduced by [BEM](http://getbem.com/introduction/), borrowing the concept of Blocks (the component), Elements (children nodes) and Modifiers (styles as a function of state). Through this API, Trousers encourages semantic organisation of styles without inadvertently increasing the runtime implications often associated with CSS-in-JS libraries.

<p align="center">
  <img width="600" height="470" src="assets/trousers-demo-web.jpg" alt="Trousers, a little library for CSS-in-JS, without the mess">
</p>

## Get started 🏗

**Installation**

`npm install --save trousers` or `yarn add trousers`

**Basic example**

A basic purple button:

```jsx
import { css, useStyles } from '@trousers/core';

const Button = props => {
    const className = useStyles(css`
        background-color: rebeccapurple;
        color: white;
    `);

    return <button className={className}>{props.children}</button>;
};

export default Button;
```

**Complete example**

A themed button with a _primary_ variant:

`app/components/button.jsx`

```jsx
import { styleCollector, useStyles } from 'trousers';

const styles = props => styleCollector('button').element`
        background-color: ${theme => theme.backgroundColor};
        border: none;
        color: ${theme => theme.textColor};
        margin: 0 10px;
        padding: 10px 20px 14px 20px;

        :hover {
            background-color: ${theme => theme.hoverColor};
            color: rgba(255, 255, 255, 0.8);
        }
    `.modifier('primary', props.primary)`
        background-color: #f95b5b;
        color: #ffffff;

        :hover {
            background-color: #e45454;
        }
    `;

const Button = props => {
    const buttonClassNames = useStyles(styles(props));

    return <button className={buttonClassNames}>{props.children}</button>;
};

export default Button;
```

`app/MyApp.jsx`

```jsx
import { ThemeProvider } from 'trousers';

import Button from './components/button';

const theme = {
    backgroundColor: 'blue',
    textColor: 'white',
    hoverColor: 'lightblue',
};

const MyApp = props => {
    return (
        <ThemeProvider theme={theme}>
            <Button primary>How do I look?</Button>
        </ThemeProvider>
    );
};

export default Button;
```

## Motivation 🧠

Components often require many **variations** and **states** to be flexible and truly reusable. Think about a _simple_ Button, it can have variations like `primary`, `secondary`, `subtle` and each variation has it's own states, `clicked`, `hover`, `loading`. But with modern CSS-in-JS libraries it can be hard to represent these variations and states in a way that makes sense to everyone and is repeatable without having to memorise specific syntax.

Consider this example:

```jsx
const Button = styled.button`
    background: ${props => (props.primary ? 'palevioletred' : 'white')};
    color: ${props => (props.primary ? 'white' : 'palevioletred')};
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
`;
```

We have a button with two variants, `default` and `primary`. Functionally it works, but semantically it's really hard to see at a glance what color will be applied when it's primary. How would we extend this further, if say, we wanted primary buttons to have a `disabled` state?

What's more, for every permutation of props, a new class will be created and attached to the `<head>`. Every class that is created incurs additional runtime cost, this can **grow exponentially** if you're not careful, resulting in a combinatorial explosion of classnames 💥. Consider a component with 3 variants and 3 possible states, that is 3 x 3 = 9, 9 eventual classes generated for one component. It doesn't scale, but we could take another approach:

```jsx
const Button = styled.button`
  background: white;
  color: palevioletred;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;

  ${props => props.primary && css`
    background: palevioletred;
    color: white;
  `}
}
```

Now that's more like it! This can be extended and scales to many variations and states.

I think [@MadeByMike](https://github.com/MadeByMike) articulated this perfectly in: [CSS Architecture for Modern JavaScript Applications](https://www.madebymike.com.au/writing/css-architecture-for-modern-web-applications/) 👌

> BEM gave semantic meaning to classnames and one of the biggest unseen values in this was we could immediately transfer our intentions to other developers across teams and even projects. If you know BEM you can look at a classname, e.g. `button--state-success` and immediately recognise this as a modifier for a button class.

But there's still a problem, this syntax has to be memorised and there's nothing stopping you from falling back into the previous example. This is where an abstraction can protect us and scale that knowledge across your codebase. This is where Trousers can help 🎉...

Using our style collector you can express these variants and states like so:

```jsx
import { styleCollector, useStyles } from 'trousers';

const styles = styleCollector('button').element`
        // Base styles applied to all buttons
        color: white;
    `.modifier('primary', props => !!props.primary)`
        // A modifier for the primary variant
        color: black;
    `.modifier('secondary', props => !!props.secondary)`
        color: blue;
    `.modifier('subtle', props => !!props.subtle)`
        color: blue;
    `;

const Button = props => {
    const classNames = useStyles(styles, props);

    return <button className={buttonClassNames}>{props.children}</button>;
};

export default Button;
```

In this scenario, Trousers will only ever mount 3 classes to the `<head>` and toggle them on and off using the predicates provided to the style collector. It will only ever mount what it needs so, if a `subtle` button is never used you wont pay the run-time cost of processing and mounting those styles.

Under the hood, style collectors are simply an array of styles. This opens the door to a lot of possibilites because it is possible to **create your own style collectors** that suit your specific needs. What if you want a state machine style collector? Or a style collector that accepts objects instead of template literals? You can simply define one and pass it straight into Trouses 😲!

## Features ✨

### Hooks-first

[Hooks are a (relatively) hot new feature in React](https://reactjs.org/docs/hooks-intro.html), which allows Trousers to access context and state while abstracting the messy details away from the consumer.
Our `useStyles` hook accepts a name, some props and an instance of `styleCollector()`. It will then evaluate everything for you and return a human-readable class name, which you can then apply to your desired element.
For example, here we define a style for the button and inner span and apply the resulting classes to their respective elements.

```jsx
const Button = props => {
    const buttonClassNames = useStyles(buttonStyles(props));

    return <button className={buttonClassNames}>{props.children}</button>;
};
```

### Composable API 🧱

Trousers is based on a monorepo architecture, meaning that the internals of the repo have been decomposed into a group of smaller stand-alone packages. This allows you to opt-in to features such as SSR, Theming and BEM-style collectors. Doing this will reduce your bundlesizes and tailor (lol) trousers to suit your application.

-   [@trousers/core](./packages/core): The most minimal version of Trousers
-   [@trousers/collector](./packages/collector): BEM Style collector
-   [@trousers/server](./packages/server): Tools for SSR
-   [@trousers/theme](./packages/theme): Theming API
-   [@trousers/theme-css](./packages/theme-css): Theming implemeneted as CSS variables
-   [@trousers/hash](./packages/hash): Simple hashing methods
-   [@trousers/registry](./packages/registry): Style registry
-   [@trousers/util](./packages/util): Types and utility methods

Otherwise you can use the base Trousers package which is an out-of-the-box composition for the above.

-   [trousers](./packages/trousers):

### Theme Support 🎨

Theming is achieved via React's Context API, which provides a lot of flexibility. You can even choose to nest themes and present a section of your app in a different way.
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

### Global styles 🌏

Every app needs _some_ form of global styling in order to import fonts or reset native styling, for example using [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) would be quite challenging to use without access to globals.

Turns out that there's a hook for that, `useGlobals`:

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

### Server side rendering (SSR)

Server side rendering with Trousers follows a similar approach to [styled-components](https://www.styled-components.com/docs/advanced#server-side-rendering). It works by firstly instantiating a `serverStyleRegistry`, wrapping your application in a `ServerProvider`, then passing that registry into the provider as a prop. Then when you render your application to a string with `react-dom/server`, Trousers will push styles into the style registry. You can then pull the styles from the registry and manually append them to the head of your document.

```jsx
import React, { FC, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';

import { ServerStyleRegistry, ServerProvider } from 'trousers';
import App from './';

const registry = new ServerStyleRegistry();

const html = renderToString(
    <ServerProvider registry={registry}>
        <App />
    </ServerProvider>,
);

// Your styles will be accessible here
const styleTags = registry.get();
```

### CSS Prop

Trousers supports a `css` prop, similar to that of `emotion` and `styled-components`! This is handy when you want to skip declaring `useStyles` hooks in your components and instead just pass style collectors directly to the components you wish to style.

For example...

```jsx
/** @jsx jsx */
import { jsx, css } from 'trousers';

const Button = ({ children }) => (
    <button
        css={css`
            background-color: #b3cde8;
            color: white;
        `}
    >
        {children}
    </button>
);
```

Just remember to import `jsx` and set it as the pragma at the top of the file.

## FAQ 🤷‍♀️

**Can't you do this in styled-components and emotion?**

This can most certainly be done in styled-components and emotion! They are both great libraries, packed with loads of features. Trousers on the other hand, aims to be a little more simple and opinionated, it urges you to be deliberate about how styles are defined for particular states so that they can be clearer and more maintainable.

**What does this have to do with hooks? Can we not compute the classname from a plain-old JS function?**

The reason Trousers is a hook was so it could access (consume) the context from within the library, without exposing that implementation detail to the user. Otherwise you would have to wrap or access the context manually and pass it into Trousers.
There are also plans on leverage hooks more down the line to enable a few new features.

## Backers

Thanks goes to all our backers! [[Become a backer](https://opencollective.com/trousers#backer)].

<a href="https://opencollective.com/trousers#backers">
    <img src="https://opencollective.com/trousers/backers.svg?width=950" />
</a>

## Resources

-   [CSS Architecture for Modern JavaScript Applications](https://www.madebymike.com.au/writing/css-architecture-for-modern-web-applications/)
-   [CSS Evolution](https://medium.com/@perezpriego7/css-evolution-from-css-sass-bem-css-modules-to-styled-components-d4c1da3a659b)
-   [BEM](https://en.bem.info/)
-   [BEM - Block Element Modifier](http://getbem.com/introduction/)
-   [How styled-components works](https://medium.com/styled-components/how-styled-components-works-618a69970421)
-   [Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)
-   [Creating a TypeScript library with minimal setup](https://michalzalecki.com/creating-typescript-library-with-a-minimal-setup/)

## Tools

-   [Stylis – a light weight css preprocessor ](https://github.com/thysultan/stylis.js)

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/danieldelcore/trousers/graphs/contributors"><img src="https://opencollective.com/trousers/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/trousers/contribute)]

#### Individuals

<a href="https://opencollective.com/trousers"><img src="https://opencollective.com/trousers/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/trousers/contribute)]

<a href="https://opencollective.com/trousers/organization/0/website"><img src="https://opencollective.com/trousers/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/1/website"><img src="https://opencollective.com/trousers/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/2/website"><img src="https://opencollective.com/trousers/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/3/website"><img src="https://opencollective.com/trousers/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/4/website"><img src="https://opencollective.com/trousers/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/5/website"><img src="https://opencollective.com/trousers/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/6/website"><img src="https://opencollective.com/trousers/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/7/website"><img src="https://opencollective.com/trousers/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/8/website"><img src="https://opencollective.com/trousers/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/trousers/organization/9/website"><img src="https://opencollective.com/trousers/organization/9/avatar.svg"></a>
