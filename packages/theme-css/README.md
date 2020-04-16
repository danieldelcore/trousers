# @trousers/theme-css

`@trousers/theme-css` is an alternate theme provider which uses [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/var) under the hood. Use this package to reduce the run-time burden theming would otherwise have on your application.

It has the same API as `@trousers/theme` so please refer to that modules [API docs for guidance](../theme).

**Please note:** Using CSS vars in legacy browsers such as IE 11 and older is not supported, you will need to consider using a polyfill or the base `@trousers/theme` package if this is a problem.
