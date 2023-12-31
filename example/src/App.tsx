import React, { Component } from 'react';

import ScrollableFeed from 'react-scrollable-feed';
import { RandomColorGenerator } from './random-color-generator';

type Props = {};
type State = {
  isAtBottom: boolean,
  items: {
    timestamp: string,
    color: string,
  }[],
  interval?: NodeJS.Timer,
}

export default class App extends Component<Props, State> {

  static intervalDelay = 800;

  private readonly scrollableRef: React.RefObject<any>;

  constructor(props: Props) {
    super(props);

    this.scrollableRef = React.createRef();
  }

  state: State = {
    isAtBottom: true,
    items: [
      this.createItem(),
      this.createItem(),
      this.createItem(),
      this.createItem(),
    ],
    interval: undefined,
  };

  updateIsAtBottomState(result: any) {
    this.setState({
      isAtBottom: result
    });
  }

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

  scrollToBottom() {
    this.scrollableRef.current.scrollToBottom();
  }

  render() {
    const { isAtBottom, items, interval } = this.state;
    return (
        <div className="container">
          <div className="row d-flex justify-content-center mt-5">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body scrollable-wrapper pt-0 pb-0 mt-2">
                  <ScrollableFeed
                      ref={this.scrollableRef}
                      onScroll={(isAtBottom: boolean) => this.updateIsAtBottomState(isAtBottom)}
                  >
                    <ul className="list-group list-group-flush">
                      {items.map((item, i) => (
                          <li key={i} className="list-group-item">
                            <span className="dot mr-2" style={{ backgroundColor: item.color }}></span>{item.timestamp}
                          </li>
                      ))}
                    </ul>
                  </ScrollableFeed>
                </div>
                <div className="text-center">
                  <p>{items.length} items</p>
                  <button onClick={() => this.addItem()} type="button" className="btn btn-primary m-2">Add Item</button>
                  {interval ? (
                      <button onClick={() => this.pause()} type="button" className="btn btn-primary m-2">Pause</button>
                  ) : (
                      <button onClick={() => this.resume()} type="button" className="btn btn-primary m-2">Autoplay</button>
                  )}
                  <button onClick={() => this.scrollToBottom()} disabled={isAtBottom} type="button" className="btn btn-primary m-2">Scroll to Bottom</button>
                  <button onClick={() => this.clear()} type="button" className="btn btn-primary m-2">Clear</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
