# react-scrollable-feed

> 

[![Build Status](https://travis-ci.com/dizco/react-scrollable-feed.svg?branch=master)](https://travis-ci.com/dizco/react-scrollable-feed)
[![NPM](https://img.shields.io/npm/v/react-scrollable-feed.svg)](https://www.npmjs.com/package/react-scrollable-feed)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![dependencies Status](https://david-dm.org/dizco/react-scrollable-feed/status.svg)](https://david-dm.org/dizco/react-scrollable-feed)
[![devDependencies Status](https://david-dm.org/dizco/react-scrollable-feed/dev-status.svg)](https://david-dm.org/dizco/react-scrollable-feed?type=dev)
[![peerDependencies Status](https://david-dm.org/dizco/react-scrollable-feed/peer-status.svg)](https://david-dm.org/dizco/react-scrollable-feed?type=peer)

Perfect for any chat UI or any kind of feed.

## Demo

View a live demo [here](https://dizco.github.io/react-scrollable-feed/).

![Live demo gif](docs/demo.gif)

## Install

```bash
npm install --save react-scrollable-feed
```

## Usage

```tsx
import * as React from 'react'

import ScrollableFeed from 'react-scrollable-feed'

class App extends React.Component {
  render() {
    const items = ['Item 1', 'Item 2'];

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

Allows to customize _when_ the scroll should occur. This will be called everytime a `componentDidUpdate` happens, which means everytime one of the props changes. You will receive as parameters the previous and the new props.

Note: `ScrollableFeedComponentProps` is defined as `Readonly<{ children?: ReactNode }> & Readonly<ScrollableFeedProps>`

If you want to compare the last children from both the previous and new props, you could do something like this :

```tsx
import * as React from 'react'

import ScrollableFeed from 'react-scrollable-feed'

class App extends React.Component {
  changeDetectionFilter(previousProps, newProps) {
    const prevChildren = previousProps.children;
    const newChildren = newProps.children;

    return prevChildren !== newChildren
      && prevChildren[prevChildren.length - 1] !== newChildren[newChildren.length - 1];
  }

  render() {
    const items = ['Item 1', 'Item 2'];

    return (
      <ScrollableFeed
        changeDetectionFilter={this.changeDetectionFilter}
      >
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </ScrollableFeed>
    );
  }
}

export default App;
```

### `viewableDetectionEpsilon`

- Type: `number`
- Default: `2`

Indicates the number of pixels of difference between the actual bottom and the current position that can be tolerated. The default setting should be fine for most use cases.

## For more details

For more details on how to integrate _react-scrollable-feed_ in your application, have a look at the [example](example) folder.

## License

MIT © [Gabriel Bourgault](https://github.com/dizco)
