/**
 * Read this: https://medium.com/styled-components/how-styled-components-works-618a69970421
 * Use this for css preprocessing: https://github.com/thysultan/stylis.js
 */

import { trousers } from 'trousers';

const Button = props => (
  <ul>
    <li>Hello</li>
    <li>Hello</li>
    <li>Hello</li>
  </ul>
);

export default trousers(Button)
  .block`
    background-color: ${theme.color.primary};
    border: 1px solid black;
  `
  .modifier((props, state) => true)`
    background-color: blue;
    border: 1px solid ${props.color};
  `
  .modifier((props, state) => true)`
    background-color: green;
    border: 1px solid ${state.color};
  `;

/**
 * Notes:
 * - memoize based on props and state
 * - - Every instance of a modifier or block should be reduced
 * - - User-friendly css names, always (maybe BEM style?)
 * - Modifiers are applied on top of block styles
 *
 * - How can we select children elements?
 *
 *
 * BLOCK: Base styles, no props or state allowed.
 * MODIFIER: Allowed to use props and state to toggle visibility
 */


 /**
  * Could we define a standard way to override styles built with trousers component?
  */

import { MyComponent } from 'my-lib';

const NewMyComponent = trousers(MyComponent)
  .modifier()`
    background-color: red;
  `;

const Button = props => (
  <ul>
    <li><NewMyComponent /></li>
    <li>Hello</li>
    <li>Hello</li>
  </ul>
);
