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

  getSnapshotBeforeUpdate(): boolean {
    if (this.wrapperRef.current && this.bottomRef.current) {
      return ScrollableFeed.isViewable(this.wrapperRef.current, this.bottomRef.current); //This argument is passed down to componentDidUpdate as 3rd parameter
    }
    return false;
  }

  componentDidUpdate({}: any, {}: any, snapshot: boolean) {
    console.log('Comonent did update', this.state, this.props, snapshot);
    if (snapshot
      && this.bottomRef && this.bottomRef.current
      && this.wrapperRef && this.wrapperRef.current
      && !ScrollableFeed.isViewable(this.wrapperRef.current, this.bottomRef.current)) {
      ScrollableFeed.scrollParentToChild(this.wrapperRef.current, this.bottomRef.current);
    }
  }

  protected static scrollParentToChild(parent: HTMLElement, child: HTMLElement): void {
    //Source: https://stackoverflow.com/a/45411081/6316091
    const parentRect = parent.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();

    if (!ScrollableFeed.isViewable(parent, child)) {
      //Scroll by offset relative to parent
      parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top;
    }
  }

  /**
   * Returns whether a child element is visible within a parent element
   * @param parent
   * @param child
   */
  private static isViewable(parent: HTMLElement, child: HTMLElement): boolean {
    //Source: https://stackoverflow.com/a/45411081/6316091

    const parentRect = parent.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    return (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parent.clientHeight);
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
