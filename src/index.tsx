import * as React from 'react'
import { ReactNode } from 'react';
import styles from './styles.css'

export type ScrollableFeedProps = {
  forceScroll?: boolean;
  animateScroll?: (element: HTMLElement, offset: number) => void;
  onScrollComplete?: () => void;
  changeDetectionFilter?: (previousProps: ScrollableFeedComponentProps, newProps: ScrollableFeedComponentProps) => boolean;
  viewableDetectionEpsilon?: number;
  className?: string;
}

type ScrollableFeedComponentProps = Readonly<{ children?: ReactNode }> & Readonly<ScrollableFeedProps>;

class ScrollableFeed extends React.Component<ScrollableFeedProps> {
  private readonly wrapperRef: React.RefObject<HTMLDivElement>;
  private readonly bottomRef: React.RefObject<HTMLDivElement>;

  constructor(props: ScrollableFeedProps) {
    super(props);
    this.bottomRef = React.createRef();
    this.wrapperRef = React.createRef();
  }

  static defaultProps: ScrollableFeedProps = {
    forceScroll: false,
    animateScroll: (element: HTMLElement, offset: number): void => {
      element.scrollBy({ top: offset });
    },
    onScrollComplete: () => {},
    changeDetectionFilter: () => true,
    viewableDetectionEpsilon: 2,
  };

  getSnapshotBeforeUpdate(): boolean {
    if (this.wrapperRef.current && this.bottomRef.current) {
      const { viewableDetectionEpsilon } = this.props;
      return ScrollableFeed.isViewable(this.wrapperRef.current, this.bottomRef.current, viewableDetectionEpsilon!); //This argument is passed down to componentDidUpdate as 3rd parameter
    }
    return false;
  }

  componentDidUpdate(previousProps: ScrollableFeedComponentProps, {}: any, snapshot: boolean): void {
    const { forceScroll, changeDetectionFilter } = this.props;
    const isValidChange = changeDetectionFilter!(previousProps, this.props);
    if (isValidChange && (forceScroll || snapshot) && this.bottomRef.current && this.wrapperRef.current) {
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
    const { viewableDetectionEpsilon } = this.props;
    if (!ScrollableFeed.isViewable(parent, child, viewableDetectionEpsilon!)) {
      //Source: https://stackoverflow.com/a/45411081/6316091
      const parentRect = parent.getBoundingClientRect();
      const childRect = child.getBoundingClientRect();

      //Scroll by offset relative to parent
      const scrollOffset = (childRect.top + parent.scrollTop) - parentRect.top;
      const { animateScroll, onScrollComplete } = this.props;
      if (animateScroll) {
        animateScroll(parent, scrollOffset);
        onScrollComplete!();
      }
    }
  }

  /**
   * Returns whether a child element is visible within a parent element
   * @param parent
   * @param child
   * @param epsilon
   */
  private static isViewable(parent: HTMLElement, child: HTMLElement, epsilon: number): boolean {
    epsilon = epsilon || 0;

    //Source: https://stackoverflow.com/a/45411081/6316091
    const parentRect = parent.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();

    const childTopIsViewable = (childRect.top >= parentRect.top);
    const childBottomIsViewable = (Math.abs(parentRect.top + parent.clientHeight - childRect.top) <= epsilon); //Use epsilon because getBoundingClientRect might return floats https://stackoverflow.com/a/40879359/6316091
    return childTopIsViewable && childBottomIsViewable;
  }

  render(): React.ReactNode {
    const { children, className } = this.props;
    const joinedClassName = styles.scrollableDiv + (className ? " " + className : "");
    return (
      <div className={joinedClassName} ref={this.wrapperRef}>
        {children}
        <div ref={this.bottomRef}></div>
      </div>
    );
  }
}

export default ScrollableFeed;
