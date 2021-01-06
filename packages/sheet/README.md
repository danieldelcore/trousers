# @trousers/sheet

`@trousers/sheet` is responsible for managing the styles that are mounted to the page.

## Installation

`yarn add @trousers/sheet` or `npm install @trousers/sheet`

## API

### `sheet()`

Is the factory function which exposes the sheet API.

**Arguments:**

-   `targetEl` (`HTMLElement`): Element which will have style tags mounted to
-   `attributeId` (`string`): The attribute which Trousers will use to identify the style tag

**Returns:**

-   `has`: (`(id: string) => boolean`): Will return true if id has been mounted to the page
-   `mount`: (`(id: string, styles: string, isGlobal?: boolean => void`): Will mount provided styles to the page. If `isGlobal` is provided style will be mounted globally.
-   `unmount`: (`(id: string) => void`): unmounts all styles associated with the provided `id`

**Example:**

```js
import Sheet from '@trousers/sheet';

const sheet = Sheet(head, 'i-love-trousers');
```

### `sheet().has()`

Will return true if id has been mounted to the page.

**Arguments:**

-   `id` (`string`): The id of the style you're checking for

**Returns:**

-   `boolean`: The status of the style

**Example:**

```js
import Sheet from '@trousers/sheet';

const sheet = Sheet(head, 'i-love-trousers');

sheet.has('bar'); // returns false;
```

### `sheet().mount()`

Will mount provided styles to the page.

**Arguments:**

-   `id` (`string`): unique identifier for the provided style
-   `styles` (`string`): style string
-   `isGlobal` (`boolean`)?: The styles should be treated as global or not

**Returns:**

-   `void`

**Example:**

```js
import Sheet from '@trousers/sheet';

const sheet = Sheet(head, 'i-love-trousers');

sheet.mount('1', '.foo{background-color:red;}');
```

### `sheet().unmount()`

Flushes all styles tracked by the provides `id`

**Arguments:**

-   `id` (`string`): unique identifier for the provided style

**Returns:**

-   `void`

**Example:**

```js
import Sheet from '@trousers/sheet';

const sheet = Sheet(head, 'i-love-trousers');

sheet.mount('1', '.foo{background-color:red;}');
sheet.unmount('1');
```
