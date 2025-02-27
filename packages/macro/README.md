# @trousers/macro

`@trousers/macro` is the most performant version of `trousers`! It drastically reduces the run-time implications of the library by offloading the heavy style processing logic to build time!

Namespacing, prefixing and processing are all handled by the macro at build-time, leaving us with simply mounting and toggling classes 🎉.

To get up and running with babel macros in your project, [see the macro user guide.](https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/user.md)

## Installation

`yarn add -D @trousers/macro` or `npm install @trousers/macro --save-dev`

## API

`@trousers/macro` is almost a direct API mirror of the `trousers` and `@trousers/react` modules, with some slight changes, namely to import structure (see example below). For API docs, refer to `@trousers/react`.

**Example:**

```diff
-/** @jsx jsx */
-import css from '@trousers/core';
-import jsx from '@trousers/react';

+import { css } from '@trousers/macro';

const styles = css('button', { backgroundColor: 'red' }).modifier('primary', {
    backgroundColor: 'blue',
});

const Button = ({ primary }) => <button css={styles} $primary={primary} />;
```
