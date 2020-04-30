# @trousers/collector

`@trousers/collector` is a style collector inspired by the principles of the BEM methodology.

It's recommended to use this style collector when want to express styles across multiple states and appearances in a semantic way.
If that's not the case, consier using `css` or a plain-ol' object.

> Note: If the API of this style collector isn't to your liking, you can easily implement your own! Please see [this guide]().

## API 🤖

### `styleCollector()`

The `styleCollector()` function is designed to collect style definitions and provide some portability. If you deside to define CSS in another file, you can do and re-import it into your component.

> NOTE: styleCollector return methods will always return `this`, which means the calls can be chained repeatedly.

**Arugments:**

-   `componentName`: String

**Returns:**

-   `styleCollector().element`
-   `styleCollector().modifier(predicate)`
-   `styleCollector().get()`

### `styleCollector().element`

A function which accepts a [Tagged Template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates).

You should treat element blocks like you would with [Elements in BEM](https://en.bem.info/methodology/quick-start/#element).

-   The element name describes its purpose ("What is this?" — item, text, etc.), not its state ("What type, or what does it look like?" — red, big, etc.).
-   The structure of an element's full name is block-name**element-name. The element name is separated from the block name with a double underscore (**).
-   The block name defines the namespace, which guarantees that the elements are dependent on the block (block\_\_elem)
-   A block can have a nested structure of elements in the DOM tree

**Arugments:**

-   `taggedTemplate`: TaggedTemplate

**Example:**

```jsx
import { styleCollector } from 'trousers';

const styles = styleCollector('button').element`
        background-color: red;
    `;
```

### `styleCollector().modifier(modifierName, predicate)`

A function that accepts a predicate function or boolean and returns a new function which accepts a tagged template. The tagged template will only be rendered if the predicate returns a truthy value.

> Note: Modifiers are dependant on order. Be sure to organise the order of your modifiers with the understanding that the bottom most modifier will potentially be overriding the style rules defined in the modifiers and elements declared before it.

Modifiers follow the same methodology as [Modifiers in BEM](https://en.bem.info/methodology/quick-start/#modifier).

-   Defines the appearance, state, or behavior of a block or element
-   A modifier can't be used alone, a modifier can't be used in isolation from the modified block or element. A modifier should change the appearance, behavior, or state of the entity, not replace it
-   You can have one or multiple modifiers active at any time
-   The modifier name describes its appearance ("What size?" or "Which theme?" and so on — size_s or theme_islands), its state ("How is it different from the others?" — disabled, focused, etc.) and its behavior ("How does it behave?" or "How does it respond to the user?" — such as directions_left-top)

**Arguments:**

-   `modifierName`: (optional) string
-   `predicate`: boolean | Function(props, state) => boolean

**Returns:**

-   `Function(TaggedTemplate)`

**Example:**

```jsx
import { styleCollector } from 'trousers';

const styles = (props, state) => styleCollector('button').element``.modifier(
    props.primary,
)`
        background-color: yellow;
    `.modifier('active', state.isActive)`
        background-color: purple;
    `.modifier('disabled', props.isDisabled)`
        background-color: grey;
    `;
```

### `styleCollector().get()`

Outputs the collected `styleDefinitions`. StyleDefintions is an array of objects that trousers passes around internally.

**StyleDefinition:**

```
{
    styles: TemplateStringsArray;
    expressions: number | string | Function(props) => number | string;
    predicate?: Predicate<Props>;
}
```

**Returns:**

-   `styleDefinitions`: StyleDefinition[];

**Example:**

```jsx
import { styleCollector } from 'trousers';

const styles = styleCollector('button')
    .element``
    .modifier(...)``;

styles.get();
```
