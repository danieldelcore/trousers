# Trousers 👖
If Styled Components and class-names had a baby

[Try it here](https://danieldelcore.github.io/trousers/)

## Philosophy 🤔
Think of trousers like `styled-components` + `classnames` + `BEM`. It is designed to allow CSS to just do CSS and lets JS to handle the rest. Trousers is designed to help you co-locate CSS and JS and opinionated in that it helps you avoid using JavaScript where CSS can take over. .ie Using JS and props to determine which CSS property is active at any given time. 

- Often is with complex expressions to determine which css property is applied in .
- Let CSS do CSS
- Colocate css and js but don't intermingle them
- Avoid complex logic in CSS. Prefer modifiers based on predicates
- Avoid creating subcomponents just to attach styling. Css selectors should be enough
- Simplify testing. Classnames can be attached to dom and snapshot tested

## Get started 🏗

**Installation**

`npm install trousers` or `yarn install trousers`

**Basic Example**

Creating a trousered component

```jsx
import { trousers, useTrousers, ThemeProvider } from 'trousers';

const styles = trousers()
    .element`
        background-color: ${theme => theme.backgroundColor};
        border-radius: 6px;
        border: none;
        box-shadow: inset 0 -4px ${theme => theme.borderColor};
        color: ${theme => theme.textColor};
        cursor: pointer;
        display: inline-block;
        font-weight: 500;
        margin: 0 10px;
        padding: 10px 20px 14px 20px;

        :hover {
            background-color: ${theme => theme.hoverColor};
            color: rgba(255, 255, 255, 0.8);
        }

        :active {
            background-color: ${theme => theme.borderColor};
        }
    `
    .modifier(props => !!props.primary)`
        background-color: #f95b5b;
        box-shadow: inset 0 -4px #c54646;
        color: #ffffff;

        :hover {
            background-color: #e45454;
        }

        :active {
            background-color: #c54646;
        }
    `;

const spanStyles = trousers()
    .element`
        font-size: 20px;
        font-style: italic;
    `;

const Button: FC = props => {
    const buttonClassNames = useTrousers('button', props, styles);
    const spanClassNames = useTrousers('button-span', props, spanStyles);

    return (
        <button className={buttonClassNames}>
            <span className={spanClassNames}>
                {props.children}
            </span>
        </button>
    );
};

export default Button;
```

## API

### `trousers()`

The `trousers()` function is designed to collect style definitions and provide some portability. If you deside to define CSS in another file, you can do and reimport it into your component.

- `trousers().element`: Because the component is the block. And it is made up of elements
- `trousers().modifier`: Elements can be modified by props. This allows you to extend the look of the element, it also helps you seperate your JS logic from your CSS

### `useTrousers`

### `<ThemeProvider />`

Accepts a `theme` and provides it to children components via context

**Example:**

```jsx
import { ThemeProvider } from 'trousers';

const theme = {
    primaryColor: 'red',
    secondaryColor: 'blue',
};

const App = () => (
    <ThemeProvider theme={theme}>
        {* Every child node will have access to the theme *}
    </ThemeProvider>
);
```

## Unit Testing

`// TODO: ...`

## TypeScript
`// TODO: ...`

## FAQs
`// TODO: ...`

## TODO:
- [ ] `attachGlobalStyle` function
- [ ] Server Side Rendering support
- [ ] Pass `state` into predicates
- [ ] CSS syntax highlighting for VSCode + Atom
- [ ] Unit tests

## Resources
- [Creating a TypeScript library with minimal setup](https://michalzalecki.com/creating-typescript-library-with-a-minimal-setup/)
- [How styled-components works](https://medium.com/styled-components/how-styled-components-works-618a69970421)

## Tools
- [light – weight css preprocessor ](https://github.com/thysultan/stylis.js)
- [Optimized JavaScript implementation of the MurmurHash algorithms](https://github.com/perezd/node-murmurhash)
