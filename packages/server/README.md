# @trousers/server

`@trousers/server` provides everything you need for Server side rendering (SSR) with Trousers.

SSR with Trousers follows a similar approach to [styled-components](https://www.styled-components.com/docs/advanced#server-side-rendering). It works by firstly instantiating a `serverStyleRegistry`, wrapping your application in a `ServerProvider`, then passing that registry into the provider as a prop. Then when you render your application to a string with `react-dom/server`, Trousers will push styles into the style registry. You can then pull the styles from the registry and manually append them to the head of your document.

```jsx
import React, { FC, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';

import { serverRegistry, ServerProvider } from 'trousers';
import App from './';

const registry = serverRegistry();

const html = renderToString(
    <ServerProvider registry={registry}>
        <App />
    </ServerProvider>,
);

// Your styles will be accessible here
const styleTags = registry.get();
```

## API

### `serverRegistry`

A style registry **for use on the server**

**Example:**

```jsx
import { serverRegistry, ServerProvider } from 'trousers';

const registry = serverRegistry();
const styleTags = registry.get();
```

### `ServerProvider`

A context provider which tells Trousers to push styles into the supplied registry, rather than `document.head`. **For use on the server.**

**Props:**

-   `registry`: serverRegistry
-   `children`: ReactChildren

**Example:**

```jsx
import React, { FC, ReactNode } from 'react';
import { renderToString } from 'react-dom/server';

import { serverRegistry, ServerProvider } from 'trousers';
import App from './';

const registry = serverRegistry();

const html = renderToString(
    <ServerProvider registry={registry}>
        <App />
    </ServerProvider>,
);

const styleTags = registry.get();
```
