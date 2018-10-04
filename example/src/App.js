import React, { Component } from 'react';

import ScrollableFeed from 'react-scrollable-feed';

export default class App extends Component {

  constructor(props) {
    super(props);
    setInterval(() => {
      this.addItem();
    }, 800);
  }

  state = {
    items: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Aliquam semper purus vitae commodo elementum.',
      'Maecenas condimentum lacus eget varius accumsan.',
      'Mauris mattis orci sit amet mi consequat tristique.',
      'Aliquam lobortis pulvinar fermentum.',
      'Donec malesuada, sem non scelerisque imperdiet.',
      'Quisque egestas.',
      'Etiam scelerisque tincidunt enim, in dictum metus dapibus.',
      'Quisque eu eros mattis, finibus lorem ut, commodo ipsum.',
      'Vivamus cursus tempor nibh ac aliquet.',
      'Nulla posuere gravida ligula tincidunt efficitur.',
      'Phasellus vel convallis neque, id placerat elit.',
      'Aenean nibh purus, consectetur hendrerit egestas in.',
      'Aliquam pretium, sapien tempus posuere eleifend.',
      'Sed eget viverra.',
    ],
  };

  addItem() {
    this.setState(prevState => ({
      items: [...prevState.items, new Date().toISOString()]
    }));
  }

  render() {
    const { items } = this.state;
    return (
      <section>
        <div className={'scrollable-wrapper'} style={{maxHeight: 300}}>
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
        </div>
        <div style={{textAlign: 'center'}}>
          <button onClick={() => this.addItem()}>Add Item</button>
        </div>
      </section>
    );
  }
}
