import React, { Component } from 'react';

import ScrollableFeed from 'react-scrollable-feed';
import { RandomColorGenerator } from './random-color-generator';

export default class App extends Component {

  static intervalDelay = 800;

  state = {
    items: [
      this.createItem(),
      this.createItem(),
      this.createItem(),
      this.createItem(),
    ],
    interval: undefined,
  };

  createItem() {
    return {
      timestamp: new Date().toISOString(),
      color: RandomColorGenerator.get(),
    }
  }

  addItem() {
    this.setState(prevState => ({
      items: [...prevState.items, this.createItem()]
    }));
  }

  pause() {
    clearInterval(this.state.interval);
    this.setState(_ => ({
      interval: undefined
    }));
  }

  resume() {
    const interval = setInterval(() => {
      this.addItem();
    }, App.intervalDelay);
    this.setState(_ => ({
      interval
    }));
  }

  clear() {
    this.setState(_ => ({
      items: []
    }));
  }

  render() {
    const { items, interval } = this.state;
    return (
      <div className="container">
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <ul className="scrollable-wrapper list-group list-group-flush">
                <ScrollableFeed
                  changeDetectionFilter={(previousProps, newProps) => {
                    const prevChildren = previousProps.children;
                    const newChildren = newProps.children;

                    return prevChildren !== newChildren
                      && prevChildren[prevChildren.length - 1] !== newChildren[newChildren.length - 1];
                  }}
                >
                  {items.map((item, i) => (
                  <li key={i} className="list-group-item">
                    <span className="dot mr-2" style={{backgroundColor: item.color}}></span>{item.timestamp}
                  </li>
                  ))}
                </ScrollableFeed>
              </ul>
            </div>
            <div className="text-center">
              <p>{items.length} items</p>
              <button onClick={() => this.addItem()} type="button" className="btn btn-primary m-2">Add Item</button>
              {interval ? (
                <button onClick={() => this.pause()} type="button" className="btn btn-primary m-2">Pause</button>
              ) : (
                  <button onClick={() => this.resume()} type="button" className="btn btn-primary m-2">Resume</button>
                )}
              <button onClick={() => this.clear()} type="button" className="btn btn-primary m-2">Clear</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}
