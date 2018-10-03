import React, { Component } from 'react';

import ScrollableFeed from 'react-scrollable-feed';

export default class App extends Component {

  constructor(props) {
    super(props);
    setInterval(() => {
      console.log('oh come on', this.state.items);
      this.setState(prevState => ({
        items: [...prevState.items, new Date().toISOString()]
      }))
    }, 3000);
  }

  state = {
    items: ['TARTE', 'TARTE2', 'Je suis pas une tarte ok?'],
  };

  render () {
    const { items } = this.state;
    return (
      <div className={'scrollable-wrapper'}>
        <ScrollableFeed maxHeight={300}>
          <p>Tu me troll</p>
          <p>Je te troll</p>
          <div>Salut</div>
          <p>Bof</p>
          {items.map((item, i) => <div key={i}>{item}</div>)}
        </ScrollableFeed>
      </div>
    );
  }
}
