# @trousers/core

`@trousers/core` is the heart of the repo, it exists to act as the most minimal and light-weight version of Trousers, allowing you to opt-out of other features such as react (`@trousers/react`) and the styled (`@trousers/styled`).

It is essentially a set of library agnostic utility functions that you can use to create your own version of Trousers. For example creating a React or Vue version.

## Installation

`yarn add @trousers/core` or `npm install @trousers/core`

## API

### `css`

The `css` method (aka Collector) aims to allow express styles across multiple states and appearances in a semantic way. Internally the styles that you supply to css will be cataloged and organized so they can efficiently be mounted to the page.

It's loosely inspired by the principles of the [_BEM methodology_](https://en.bem.info/methodology/quick-start). So familiar concepts like `element` and `modifiers` can be conceptually treated in the same way.

You should treat element blocks the same as [Elements in BEM](https://en.bem.info/methodology/quick-start/#element).

The element describes its purpose ("What is this?" — item, text, etc.), not its state ("What type, or what does it look like?" — red, big, etc.).

**Arguments:**

-   `elementId` (`string`)?: The id that represents the element (optional)
-   `elementStyles` (`CSSObject`): The styles that represent the element. Treat these styles as the base for which modifier styles might override. Styles are in object notation, rather than template literals, for runtime performance purposes. If you wish to use template literals please check out [`@trousers/macro`](todo).

**Returns:**

-   `CollectorReturn`: The chainable methods of the collector (see below)

**Example:**

```js
import css from '@trousers/core';

const styles = css('Button', { color: 'red' });
```

### `css().modifier()`

The `modifier` is a chainable method which allows you to express "modifiers" or "variants" of your styles.

-   Modifiers deliberately **override element styles** which avoids duplication and the need for dynamic logic.
-   You can provide more than one modifier.
-   Modifiers are typically **toggled on and off when conditions are met**. For example, if a react prop is truthy, trousers might toggle the associated modifier on (see [@trousers/react](todo)).
-   **Modifiers are dependant on order**. Be sure to organise the order of your modifiers with the understanding that the bottom most modifier will potentially be overriding the style rules defined in the modifiers and elements declared before it.

**Arguments:**

-   `modifierId` (`string`)?: The id that represents the modifier (optional)
-   `modifierStyles` (`CSSObject`): The styles that represent the modifier. Treat these styles as overrides or additions to the element styles.

**Returns:**

-   `CollectorReturn`: The chainable methods of the collector (see below)

**Example:**

```js
import css from '@trousers/core';

const styles = css('Button', { color: 'red' })
    .modifier('Primary', { color: 'blue' })
    .modifier('Secondary', { color: 'grey' });
```

### `css().global()`

The `global` is a chainable method which allows you to express global styles (styles that are applied to more than a single element). Consider a css reset or adding styles to the `:root`.

**Arguments:**

-   `globalStyles` (`CSSObject`): The styles that represent the a global.

**Returns:**

-   `CollectorReturn`: The chainable methods of the collector (see below)

**Example:**

```js
import css from '@trousers/core';

const styles = css('MyGlobal', {}).global({ ':root': 'color: red;' });
```

### `css().theme()`

The `theme` is a chainable method which allows you to express [css custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) in object notation.

-   Themes apply to the element they are referenced in and also their children.
-   They can be used by Elements, Modifiers and Globals.
-   They are mounted via a simple class and can be used like any css custom property

**Arguments:**

-   `themeObject` (`Object`): The object that represents the theme

**Returns:**

-   `CollectorReturn`: The chainable methods of the collector (see below)

**Example:**

```js
import css from '@trousers/core';

const styles = css('MyElement', { color: 'var(--primary-color)' })
    .modifier('Primary', { color: 'var(--secondary-color)' })
    .theme({
        primaryColor: 'red',
        secondaryColor: 'blue',
    });
```

### `prefix`

This method prefixes properties and their values.

-   Prefixing is only indended to be for modern browsers. If you intend to target legacy browsers you'll need to provide the relevant prefixes manually.

**Arguments:**

-   `property`(`string`): css property (`background`, `color`, etc)
-   `value`(`string`): value of property (`red`, '100px`, etc)

**Returns:**

-   `string`: prefixed string including both property and value

**Example:**

```js
import { prefix } from '@trousers/core';

const result = prefix('appearance', 'none');

/*
Result:
'appearance: none;-moz-appearance: none;-webkit-appearance: none;-moz-appearance: none;'
*/
```

### `namespace`

Namespaces styles with nested selectors etc, into css with valid selectors.

**Arguments:**

-   `id`(`string`): The id to use when namespacing your styles
-   `styles`(`CSSObject`): The styles to process

**Returns:**

-   `Record<string, string>`: key value pairs of styles, in valid CSS

**Example:**

```js
import { namespace } from '@trousers/core';

const result = namespace('.my-id', {
    background: 'red',
    button: {
        background: 'violet',
        span: {
            background: 'green',
        },
    },
});

/*
Result:
{
    '.my-id': {
        background: 'red',
    },
    '.my-id button': {
        background: 'violet',
    },
    '.my-id button span': {
        background: 'green',
    },
}
*/
```

### `process`

Process is a special function which takes ids and styles and applies the above methods like `namespace` and `prefix` to them. The result is a shape that can easily be passed to `@trousers/sheet` for mounting.

**Arguments:**

-   `id`(`string`): The id to use when namespacing your styles
-   `styles`(`CSSObject`): The styles to process

**Returns:**

-   `Record<string, string>`: key value pairs of styles, namespaced and prefixed

**Example:**

```js
import { process } from '@trousers/core';

const result = process('.my-id', {
    backgroundColor: 'red',
    '& button': {
        backgroundColor: 'violet',
    },
});

/*
Result:
{
    '.my-id': 'background-color: red;',
    '.my-id button': 'background-color: violet;',
}
*/
```

### `themify`

`themify` accepts an object and converts it into its css custom properties counterpart

**Arguments:**

-   `theme`(`Object`): Theme object in object notation

**Returns:**

-   `Record<string,string>`: An object containing css custom properties and their values as key-value pairs

**Example:**

```js
import { themify } from '@trousers/core';

const result = themify({
    background: 'red',
    typography: {
        heading: 'violet',
        paragraph: {
            small: 'black',
            large: 'blue',
        },
    },
});

/*
Result:
{
    '--background': 'red',
    '--typography-heading': 'violet',
    '--typography-paragraph-large': 'blue',
    '--typography-paragraph-small': 'black',
};
*/
```

### `isBrowser`

Used to determine whether to use browser or SSR logic.

**Arguments:**

N/A

**Returns:**

-   `boolean`: Returns true when invoked on the browser, false if on the server.

**Example:**

```js
import { isBrowser } from '@trousers/core';

isBrowser(); // true, i'm running in the browser
```
