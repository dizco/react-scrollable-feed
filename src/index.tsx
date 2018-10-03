import * as React from 'react'

import styles from './styles.css'

export interface ScrollableFeedProps {
  maxHeight: number;
  scrollBehavior?: string; //TODO: Default to auto or smooth?
}

class ScrollableFeed extends React.Component<ScrollableFeedProps> {
  private wrapperRef: React.RefObject<HTMLDivElement>;
  private bottomRef: React.RefObject<HTMLDivElement>;

  constructor(props: ScrollableFeedProps) {
    super(props);
    this.bottomRef = React.createRef();
    this.wrapperRef = React.createRef();
  }

  getSnapshotBeforeUpdate() {
    return this.isViewable(this.wrapperRef.current, this.bottomRef.current); //This argument is passed down to componentDidUpdate as 3rd parameter
  }

  componentDidUpdate({}: any, {}: any, snapshot: any) {
    console.log('Comonent did update', this.state, this.props, snapshot);
    if (snapshot && !this.isViewable(this.wrapperRef.current, this.bottomRef.current)
      && this.bottomRef && this.bottomRef.current
      && this.wrapperRef && this.wrapperRef.current) {
      this.scrollParentToChild(this.wrapperRef.current, this.bottomRef.current);
    }
  }

  private scrollParentToChild(parent: any, child: any) {
    //Source: https://stackoverflow.com/a/45411081/6316091
    // Where is the parent on page
    var parentRect = parent.getBoundingClientRect();
    // What can you see?
    var parentViewableArea = {
      height: parent.clientHeight,
      width: parent.clientWidth
    };

    // Where is the child
    var childRect = child.getBoundingClientRect();
    // Is the child viewable?
    var isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);

    // if you can't see the child try to scroll parent
    if (!isViewable) {
      // scroll by offset relative to parent
      parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
    }
  }

  private isViewable(parent: any, child: any): boolean {
    // Where is the parent on page
    var parentRect = parent.getBoundingClientRect();
    // What can you see?
    var parentViewableArea = {
      height: parent.clientHeight,
      width: parent.clientWidth
    };

    // Where is the child
    var childRect = child.getBoundingClientRect();
    // Is the child viewable?
    return (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);
  }

  render() {
    const children = this.props.children;
    return (
      <div className={styles.scrollableDiv} style={{maxHeight: this.props.maxHeight}} ref={this.wrapperRef}>
        {children}
        <div ref={this.bottomRef}></div>
      </div>
    );
  }
}

export default ScrollableFeed;
