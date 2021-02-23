# @trousers/hash

`@trousers/hash` is a simple hash package which accepts a string and returns the hashed equivalent.

## Installation

`yarn add @trousers/hash` or `npm install @trousers/hash`

## API

### `hash`

Accepts a string and returns a hashed number. Calling it twice with the same input should yield the same result.

**Example:**

```jsx
import hash from '@trousers/hash';

hash(`
    .yomama {
        width: 99999999px;
    }
`);

// Outputs: 4658051
```
