# react-scrollable-feed

> 

[![NPM](https://img.shields.io/npm/v/react-scrollable-feed.svg)](https://www.npmjs.com/package/react-scrollable-feed) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

View a live demo [here](https://dizco.github.io/react-scrollable-feed/).

## Install

```bash
npm install --save react-scrollable-feed
```

## Usage

```tsx
import * as React from 'react'

import ScrollableFeed from 'react-scrollable-feed'

class Example extends React.Component {
  render() {
    const items = ['Item 1', 'Item2'];
    return (
      <ScrollableFeed>
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </ScrollableFeed>
    );
  }
}
```

## Options

### `forceScroll`

- Type: `boolean`
- Default: `false`

If set to true, will scroll to the bottom after each update on the component. By default, if the scrollable section is not at the bottom _before_ the update occurs, it will leave the scroll at the same position.

### `animateScroll`

- Type: `(element: HTMLElement, offset: number) => void`
- Default: `element.scrollBy({ top: offset });`

Allows to override the scroll animation by any implementation.

### `onScrollComplete`

- Type: `() => void`
- Default: `() => {}`

Is called after the scroll animation has been executed.

### `changeDetectionFilter`

- Type: `(previousProps: ScrollableFeedComponentProps, newProps: ScrollableFeedComponentProps) => boolean`
- Default: `() => true`

Allows to customize _when_ the scroll should occur. This will be called everything a `componentDidUpdate` happens, which means everytime one of the props changes. You will receive in parameter the previous and new props.

Note: `ScrollableFeedComponentProps` is defined as `Readonly<{ children?: ReactNode }> & Readonly<ScrollableFeedProps>`

If you want to compare the last children from both the previous and new props, you could do something like this :

```tsx
import * as React from 'react'

import ScrollableFeed from 'react-scrollable-feed'

class Example extends React.Component {
  render() {
    const items = ['Item 1', 'Item2'];
    return (
      <ScrollableFeed
        changeDetectionFilter={(previousProps, newProps) => {
          const prevChildren = previousProps.children;
          const newChildren = newProps.children;
      
          return prevChildren !== newChildren
            && prevChildren[prevChildren.length - 1] !== newChildren[newChildren.length - 1];
        }}
      >
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </ScrollableFeed>
    );
  }
}
```

## License

MIT © [Gabriel Bourgault](https://github.com/dizco)
