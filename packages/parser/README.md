# @trousers/parser

`@trousers/parser` contains a few helpful utilities for parsing and dealing with styles as objects or template literals

## API

### `splitRules`

Accepts a template string and returns an array where styles are seperated by selector or @rule.

This is really helpful when passing styles to `insertRule` as it's quite fussy with its inputs.

**Example:**

```jsx
import { splitRules } from '@trousers/parser';

splitRules(`
    .yomama {
        width: 99999999px;
    }

    #titanic {
      float: none;
    }
`);

/**
 * Outputs:
 *
 * Array [
 *  ".yomama {
 *      width: 99999999px;
 *  }",
 *  "#titanic {
 *    float: none;
 *  }",
 */
```

### `parseObject`

`parseObject` accepts css in style notation and outputs its equivalent in tagged tempalate literal

**Example:**

```jsx
import { parseObject } from '@trousers/parser';

parseObject({
    backgroundColor: 'red',
    color: 'purple',
    borderRadius: '2px',
});

/**
 *  Outputs:
 *  'background-color: red;\ncolor: purple;\nborder-radius: 2px;'
 */
```
