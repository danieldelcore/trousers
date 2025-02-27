<p align="center">
  <img width="300" height="300" src="assets/trousers-logo.png" alt="Trousers, a little library for CSS-in-JS, without the mess">
</p>

# Trousers 👖

[![min](https://img.shields.io/bundlephobia/min/trousers.svg)](https://www.npmjs.com/package/trousers)
[![npm](https://img.shields.io/npm/v/trousers.svg)](https://www.npmjs.com/package/trousers)
[![Downloads per month](https://img.shields.io/npm/dm/trousers.svg)](https://www.npmjs.com/package/trousers)

React components are more stylish with Trousers!

[Try it here](https://danieldelcore.github.io/trousers/)

Trousers is a CSS-in-JS library designed to help developers author React apps with performant and semantic CSS. Trousers encourages semantic organization of styles without inadvertently increasing the runtime implications often associated with CSS-in-JS libraries.

## Table of Contents

<!-- toc -->

- [Trousers 👖](#trousers-)
  - [Table of Contents](#table-of-contents)
  - [Get started](#get-started)
  - [Features](#features)
  - [Core concepts](#core-concepts)
    - [Modifiers](#modifiers)
    - [Pseudo states](#pseudo-states)
    - [Media queries](#media-queries)
    - [Keyframe animations](#keyframe-animations)
    - [Theming](#theming)
    - [Globals](#globals)
    - [CSS prop](#css-prop)
    - [Performance](#performance)
    - [Multi-package architecture](#multi-package-architecture)
  - [Motivation](#motivation)
  - [API Reference](#api-reference)
  - [Built with](#built-with)
  - [Inspired by](#inspired-by)

<!-- tocstop -->

## Get started

Basic usage: `yarn add trousers` or `npm install trousers`

Recommended for performance: `yarn add @trousers/macro` or `npm install @trousers/macro`

## Features

-   Lightweight
-   Zero-config SSR
-   Composable
-   Modifiers (aka variants)
-   Globals
-   Theming

## Core concepts

### Modifiers

```jsx
import { css } from 'trousers';

const styles = css({
    background: 'grey',
    color: 'black',
}).modifier('primary', {
    background: 'red',
    color: 'white',
});
```

### Pseudo states

```jsx
import { css } from 'trousers';

const styles = css({
    backgroundColor: 'red',
    color: 'white',

    ':hover': {
        backgroundColor: 'blue',
    },
    ':active': {
        backgroundColor: 'green',
    },
});
```

### Media queries

```jsx
import { css } from 'trousers';

const styles = css({
    backgroundColor: 'red',
    color: 'white',

    '@media screen and (max-width: 992px)': {
        '&': {
            background: 'violet',
        },
    },
});
```

### Keyframe animations

```jsx
import { css } from 'trousers';

const styles = css({
    backgroundColor: 'red',
    color: 'white',
    animation: 'moveitmoveit 5s infinite',
    '@keyframes moveitmoveit': {
        from: { top: '0px' },
        to: { top: '200px' },
    },
});
```

### Theming

```jsx
import { css } from 'trousers';

const styles = css('MyElement', { color: 'var(--primary-color)' })
    .modifier('Primary', { color: 'var(--secondary-color)' })
    .theme({
        primaryColor: 'red',
        secondaryColor: 'blue',
    });
```

### Globals

Every app needs _some_ form of global styling in order to import fonts or reset native styling, for example using [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) would be quite challenging to use without access to globals.

This is where the `css.global` function can help.

```jsx
/** @jsx jsx */
import { css, jsx } from 'trousers';

const globalStyles = css({}).global({
    '*': {
        boxSizing: 'border-box';
    }
});

const App = () => (
    <div css={globalStyles}>
        <h1>Welcome to my website!</h1>
    </div>
);
```

### CSS prop

Trousers supports a css prop, similar to that of [emotion](https://emotion.sh/docs/css-prop) and [styled-components](https://styled-components.com/docs/api#css-prop)!

Just remember to import `jsx` and set it as the pragma at the top of the file.

```jsx
/** @jsx jsx */
import { jsx, css } from 'trousers';

const Button = ({ children }) => (
    <button
        css={css({
            backgroundColor: 'red',
            color: 'white',
        })}
    >
        {children}
    </button>
);
```

### Performance

Trousers in it's default state is a run-time library, even some CSS-in-JS libraries that boast near-zero runtime have hundreds of lines of code to execute before they mount a style block to the page. Trousers is no different, that's why **we provide and recommend using our [babel macro](https://github.com/kentcdodds/babel-plugin-macros): [`@trousers/macro`](packages/macro)**.

[`@trousers/macro`](packages/macro) is the most performant version of Trousers! It drastically reduces the runtime implications of the library by offloading the heavy style processing logic to build-time where possible! Namespacing, prefixing and processing are all handled by the macro at build time, leaving us with simply mounting and toggling classes 🎉.

For more information see: [`@trousers/macro`](packages/macro)

### Multi-package architecture

Trousers is based on a monorepo architecture, meaning that the internals of the repo have been decomposed into a group of smaller stand-alone packages. Doing this will reduce your bundlesizes and tailor (lol) Trousers to suit your needs.

If you're looking to use Trousers for the first time, you'll likely want the [`trousers`](packages/trousers) package.
If run-time is your concern, you want the most performant version of the library, consider using [`@trousers/macro`](packages/macro).
If you're feeling adventurous and want to use the Trousers to create your own CSS-in-JS library or even take it in your own direction, use [`@trousers/core`](packages/core).

## Motivation

Trousers discourages the use of dynamic expressions in styles that implicitly increase the runtime implications of your application. Instead, it encourages the use of modifiers (aka variants) to toggle blocks of styles.

You might have seen this pattern emerging in some usages of CSS-in-JS:

```js
styled.button`
 background: ${props => (props.primary ? 'red' : 'grey')}
 color: ${props => (props.primary ? 'white' : 'black')};
 font-size: 1em;
 margin: 1em;
`;
```

What's happening here is that we're calculating the two properties individually, with runtime logic. This is ok for this small usage, but you can probably see how quickly this will get complicated as new variants are added over time. Not to meantion that for every permutation of these properties a new class will be calculated and mounted to the page.

Trousers discourages dynamic interpolations like this and instead provides modifiers to help you fall into the right patterns. Only one class will be calculated and mounted per modifier and they're structured to be easier reason about at a glance.

```jsx
const styles = css({
    background: 'grey',
    color: 'black',
    fontSize: '1em',
    margin: '1em',
}).modifier('primary', {
    background: 'red',
    color: 'white',
});
```

With this, you can now clearly see that this style block has two different variants 'default' and 'primary', which will only ever process and mount 2 classes to the page, it's clear what properties are applied to which scenarios when.

For a more in depth explanation read my motivation blog post: [CSS-in-JS: What happened to readability](https://danieldelcore.medium.com/css-in-js-what-happened-to-readability-11fd43552c35)

## API Reference

For API documentation, please refer to the relevant package README.

-   [`trousers`](packages/trousers): Is the base packages which re-exports all of the modules in the sub-packages
-   [`@trousers/macro`](packages/macro): **(Recommended)** Babel macro that moves 99% of Trousers' run-time logic to build-time!
-   [`@trousers/core`](packages/core): Holds all of the underlying logic of trousers, including the css collector.
-   [`@trousers/react`](packages/react): React implementation of Trousers
-   [`@trousers/styled`](packages/styled): Styled Components like API
-   [`@trousers/sheet`](packages/sheet): Mount styles via the CSSStyleSheet API (CSSOM wrapper)
-   [`@trousers/hash`](packages/hash): A tiny hashing function

## Built with

-   [changesets 🦋](https://github.com/atlassian/changesets)
-   [preconstruct 🎁](https://github.com/danieldelcore/trousers)
-   [manypkg ☔️](https://github.com/Thinkmill/manypkg)

## Inspired by

Please do yourself a favour and checkout these fantastic libraries:

-   [styled-components 💅](https://styled-components.com/)
-   [emotion 👩‍🎤](https://emotion.sh/)
-   [compiled](https://compiledcssinjs.com/)
-   [stitches](https://stitches.dev/)
