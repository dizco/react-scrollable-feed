import * as React from 'react'

import styles from './styles.css'

export interface ScrollableFeedProps {
  maxHeight: number;
  scrollBehavior?: string; //TODO: Default to auto or smooth?
}

class ScrollableFeed extends React.Component<ScrollableFeedProps> {
  private bottomRef: React.RefObject<HTMLDivElement>;

  constructor(props: ScrollableFeedProps) {
    super(props);
    this.bottomRef = React.createRef();
  }

  getSnapshotBeforeUpdate() {
    return this.visibleY(this.bottomRef.current); //This argument is passed down to componentDidUpdate as 3rd parameter
  }

  componentDidUpdate({}: any, {}: any, snapshot: any) {
    console.log('Comonent did update', this.state, this.props, snapshot);
    if (snapshot && this.bottomRef.current) {
      this.bottomRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }

  render() {
    const children = this.props.children;
    return (
      <div className={styles.scrollableDiv} style={{maxHeight: this.props.maxHeight}}>
        {children}
        <div ref={this.bottomRef}></div>
      </div>
    );
  }

  private visibleY(el: any): boolean{
    //Source: https://stackoverflow.com/a/21627295/6316091
    var rect = el.getBoundingClientRect(), top = rect.top, height = rect.height,
      el = el.parentNode;
    do {
      rect = el.getBoundingClientRect();
      if (top > rect.bottom) return false;
      // Check if the element is out of view due to a container scrolling
      if ((top + height) <= rect.top) return false
      el = el.parentNode;
    } while (el != document.body);
    // Check its within the document viewport
    return top <= document.documentElement.clientHeight;
  };
}

export default ScrollableFeed;
