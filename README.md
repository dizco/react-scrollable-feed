# react-scrollable-feed

> 

[![NPM](https://img.shields.io/npm/v/react-scrollable-feed.svg)](https://www.npmjs.com/package/react-scrollable-feed) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

## License

MIT © [Gabriel Bourgault](https://github.com/dizco)
