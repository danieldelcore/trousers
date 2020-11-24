<p align="center">
  <img width="300" height="300" src="assets/trousers-logo.png" alt="Trousers, a little library for CSS-in-JS, without the mess">
</p>

# Trousers 👖

[![min](https://img.shields.io/bundlephobia/min/trousers.svg)](https://www.npmjs.com/package/trousers)
[![npm](https://img.shields.io/npm/v/trousers.svg)](https://www.npmjs.com/package/trousers)
[![Downloads per month](https://img.shields.io/npm/dm/trousers.svg)](https://www.npmjs.com/package/trousers)

React components are more stylish with Trousers!

[Try it here](https://danieldelcore.github.io/trousers/)

Trousers is a [hooks-first](https://reactjs.org/docs/hooks-overview.html) CSS-in-JS library, designed to help developers author React apps with performant and semantic CSS. Trousers encourages semantic organisation of styles without inadvertently increasing the runtime implications often associated with CSS-in-JS libraries.

<p align="center">
  <img width="600" height="470" src="assets/trousers-demo-web.jpg" alt="Trousers demo">
</p>

## Table of Contents

<!-- toc -->
<!-- tocstop -->

## Get started

## Features

### CSS collector

### CSS Prop

### Modifiers

### Theming

### Globals

### Zero-config SSR

### Pseudo states

### Media queries

### Keyframe animations

### Multi-package architecture

Trousers is based on a monorepo architecture, meaning that the internals of the repo have been decomposed into a group of smaller stand-alone packages. Doing this will reduce your bundlesizes and tailor (lol) Trousers to suit your application.

-   `trousers`: Is the base packages which re-exports all of the modules in the sub-packages
-   `@trousers/core`: Holds all of the underlying logic of trousers, including the css collector.
-   `@trousers/macro`: Babel macro that moves 99% of Trousers' runtime logic to build-time
-   `@trousers/react`: React implementation of Trousers
-   `@trousers/styled`: styled-components like API
-   `@trousers/sheet`: Mount styles to CSSStyleSheet API (CSSOM wrapper)
-   `@trousers/hash`: Tiny hashing function

## API Reference

## Built with...

-   [changesets 🦋](https://github.com/atlassian/changesets)
-   [preconstruct 🎁](https://github.com/danieldelcore/trousers)
-   [manypkg ☔️](https://github.com/Thinkmill/manypkg)
