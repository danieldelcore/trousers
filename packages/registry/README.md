# @trousers/registry

`@trousers/registry` is responsible for storing the state of the styles have been mounted, mounting them to the head of the document and also providing a way to clear the styles.

## API

### `registry()`

Is the factory function which exposes the registry API.

**Arguments:**

-   `parentElement`: HTMLElement
-   `attributeId`: string
-   `options`?: Object
    -   `forceNewNode`: boolean
    -   `appendBefore`: HTMLElement

**Returns:**

-   `register`: Function
-   `clear`: Function
-   `has`: Function

### `registry.register(id, styles, isGlobal)`

Registers provided styles. Please note that this method is significantly faster in prodmode because it uses [insertRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule). However the drawback is that you cannot augment the styles once they're mounted.

**Arguments:**

-   `id`: string - unique identifier for the provided style
-   `styles`: string - style string
-   `isGlobal`?: boolean - whether the styles should be treated as global or not

**Example:**

```jsx
import registry from '@trousers/registry';

const clientRegistry = registry(
    document.createElement('head'),
    'i-love-trousers',
);
clientRegistry.register('1', 'background-color:red;');
```

### `registry.has(id)`

Returns true if the style id is already tracked by this registry

**Arguments:**

-   `id`: string - unique identifier for the provided style

**Example:**

```jsx
import registry from '@trousers/registry';

const clientRegistry = registry(
    document.createElement('head'),
    'i-love-trousers',
);

clientRegistry.has('1'); // Returns false!
clientRegistry.register('1', 'background-color:red;');
clientRegistry.has('1'); // Returns true!
```

### `registry.clear()`

Flushes all styles tracked by this registry

**Example:**

```jsx
import registry from '@trousers/registry';

const clientRegistry = registry(
    document.createElement('head'),
    'i-love-trousers',
);

clientRegistry.register('1', 'background-color:red;');
clientRegistry.clear(); // clears the style element attached to this registry
```
