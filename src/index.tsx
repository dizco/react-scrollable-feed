import * as React from 'react'

import styles from './styles.css'

export type ScrollableFeedProps = {
  forceScroll?: boolean;
  animateScroll?: (element: HTMLElement, offset: number) => void;
  onScroll?: () => void;
}

class ScrollableFeed extends React.Component<ScrollableFeedProps> {
  private readonly wrapperRef: React.RefObject<HTMLDivElement>;
  private readonly bottomRef: React.RefObject<HTMLDivElement>;

  constructor(props: ScrollableFeedProps) {
    super(props);
    this.bottomRef = React.createRef();
    this.wrapperRef = React.createRef();
  }

  static defaultProps = {
    forceScroll: false,
    animateScroll: (element: HTMLElement, offset: number): void => {
      element.scrollBy({top: offset, behavior: 'smooth'});
    },
  };

  getSnapshotBeforeUpdate(): boolean {
    if (this.wrapperRef.current && this.bottomRef.current) {
      return ScrollableFeed.isViewable(this.wrapperRef.current, this.bottomRef.current); //This argument is passed down to componentDidUpdate as 3rd parameter
    }
    return false;
  }

  componentDidUpdate({}: any, {}: any, snapshot: boolean): void {
    const { forceScroll } = this.props;
    if ((forceScroll || snapshot) && this.bottomRef.current && this.wrapperRef.current) {
      this.scrollParentToChild(this.wrapperRef.current, this.bottomRef.current);
    }
  }

  componentDidMount(): void {
    //Scroll to bottom from the start
    if (this.bottomRef.current && this.wrapperRef.current) {
      this.scrollParentToChild(this.wrapperRef.current, this.bottomRef.current);
    }
  }

  /**
   * Scrolls a parent element such that the child element will be in view
   * @param parent
   * @param child
   */
  protected scrollParentToChild(parent: HTMLElement, child: HTMLElement): void {
    //Source: https://stackoverflow.com/a/45411081/6316091
    const parentRect = parent.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();

    if (!ScrollableFeed.isViewable(parent, child)) {
      //Scroll by offset relative to parent
      const scrollOffset = (childRect.top + parent.scrollTop) - parentRect.top;
      const { animateScroll } = this.props;
      if (animateScroll) {
        animateScroll(parent, scrollOffset);
      }
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

  render(): JSX.Element {
    const { children } = this.props;
    return (
      <div className={styles.scrollableDiv} ref={this.wrapperRef}>
        {children}
        <div ref={this.bottomRef}></div>
      </div>
    );
  }
}

export default ScrollableFeed;
