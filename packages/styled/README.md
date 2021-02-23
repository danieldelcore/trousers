# @trousers/styled

`@trousers/styles` is an implementation of Trousers for lovers of the Styled Components API (with a few tweaks).

## Installation

`yarn add @trousers/styled` or `npm install @trousers/styled`

## API

### `styled`

The `styled` method is a factory function which provides you with a way to quickly create and style components.
It is able to be used in two separate ways...

1. Dot notation `styled.div`
2. Function notation `styled('div')`

**Arguments:**

-   `tagId` (`string`)?: The id of the element tag you wish to create (ie. div, button, span, etc)

**Returns:**

-   `Record<Elements>`: HTML elements ids as an object (see Dot notation)
-   `(styles: Collector) => ReactComponent`: Returns a method which accepts a css collector

**Example:**

```js
import styled, { css } from '@trousers/styled';

// Dot notation
const StyledDiv = styled.div(css('element', { color: 'red' }));

// Function notation
const StyledDiv = styled('div')(css('element', { color: 'red' }));
```
