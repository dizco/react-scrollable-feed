import * as React from 'react'
import { ReactNode } from 'react';
import styles from './styles.css'

export enum ScrollDirection {
  Upwards = 0,
  Downwards = 1
}

export type ScrollableFeedProps = {
  forceScroll?: boolean;
  scrollDirection?: ScrollDirection;
  animateScroll?: (element: HTMLElement, offset: number) => void;
  onScrollComplete?: () => void;
  changeDetectionFilter?: (previousProps: ScrollableFeedComponentProps, newProps: ScrollableFeedComponentProps) => boolean;
  viewableDetectionEpsilon?: number;
  className?: string;
  onScroll?: (isAtBottom: boolean, isAtTop: boolean) => void;
}

type ScrollableFeedComponentProps = Readonly<{ children?: ReactNode }> & Readonly<ScrollableFeedProps>;

class ScrollableFeed extends React.Component<ScrollableFeedProps> {
  private readonly wrapperRef: React.RefObject<HTMLDivElement>;
  private readonly topRef: React.RefObject<HTMLDivElement>;
  private readonly bottomRef: React.RefObject<HTMLDivElement>;

  constructor(props: ScrollableFeedProps) {
    super(props);
    this.topRef = React.createRef();
    this.bottomRef = React.createRef();
    this.wrapperRef = React.createRef();
    this.handleScroll = this.handleScroll.bind(this);
  }

  static defaultProps: ScrollableFeedProps = {
    forceScroll: false,
    scrollDirection: ScrollDirection.Downwards,
    animateScroll: (element: HTMLElement, offset: number): void => {
      if (element.scrollBy) {
        element.scrollBy({ top: offset });
      }
      else {
        element.scrollTop = offset;
      }
    },
    onScrollComplete: () => {},
    changeDetectionFilter: () => true,
    viewableDetectionEpsilon: 2,
    onScroll: () => {},
  };

  getSnapshotBeforeUpdate(): boolean {
    if (this.wrapperRef.current) {
      const { viewableDetectionEpsilon, scrollDirection } = this.props;
      if (scrollDirection === ScrollDirection.Downwards && this.bottomRef.current) {
        return ScrollableFeed.isViewable(this.wrapperRef.current, this.bottomRef.current, viewableDetectionEpsilon!); //This argument is passed down to componentDidUpdate as 3rd parameter
      }
      if (scrollDirection === ScrollDirection.Upwards && this.topRef.current) {
        return ScrollableFeed.isViewable(this.wrapperRef.current, this.topRef.current, viewableDetectionEpsilon!); //This argument is passed down to componentDidUpdate as 3rd parameter
      }
    }
    return false;
  }

  componentDidUpdate(previousProps: ScrollableFeedComponentProps, {}: any, snapshot: boolean): void {
    const { forceScroll, scrollDirection, changeDetectionFilter } = this.props;
    const isValidChange = changeDetectionFilter!(previousProps, this.props);
    if (isValidChange && (forceScroll || snapshot) && this.wrapperRef.current) {
      if (scrollDirection === ScrollDirection.Downwards && this.bottomRef.current) {
        this.scrollParentToChild(this.wrapperRef.current, this.bottomRef.current);
      }
      else if (scrollDirection === ScrollDirection.Upwards && this.topRef.current) {
        this.scrollParentToChild(this.wrapperRef.current, this.topRef.current);
      }
    }
  }

  componentDidMount(): void {
    //Scroll to target from the start
    const { scrollDirection } = this.props;
    if (scrollDirection === ScrollDirection.Downwards && this.bottomRef.current && this.wrapperRef.current) {
      this.scrollParentToChild(this.wrapperRef.current, this.bottomRef.current);
    }
    else if (scrollDirection === ScrollDirection.Upwards && this.topRef.current && this.wrapperRef.current) {
      this.scrollParentToChild(this.wrapperRef.current, this.topRef.current);
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
      console.log("Scroll offset", scrollOffset, childRect.top, parent.scrollTop, parentRect.top);
      const { animateScroll, onScrollComplete } = this.props;
      if (animateScroll) {
        animateScroll(parent, scrollOffset);
        onScrollComplete!();
      }
    }
  }

  /**
   * Returns whether a child element is visible within a parent element
   *
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

    const childOffsetToParentBottom = parentRect.top + parent.clientHeight - childRect.top;
    const childBottomIsViewable = childOffsetToParentBottom + epsilon >= 0;

    return childTopIsViewable && childBottomIsViewable;
  }

  /**
   * Fires the onScroll event, sending isAtBottom boolean as its first parameter
   */
  protected handleScroll(): void {
    const { viewableDetectionEpsilon, onScroll } = this.props;
    if (onScroll && this.bottomRef.current && this.topRef.current && this.wrapperRef.current) {
      const isAtBottom = ScrollableFeed.isViewable(this.wrapperRef.current, this.bottomRef.current, viewableDetectionEpsilon!);
      const isAtTop = ScrollableFeed.isViewable(this.wrapperRef.current, this.topRef.current, viewableDetectionEpsilon!);
      onScroll(isAtBottom, isAtTop);
    }
  }

  /**
   * Scroll to the bottom
   */
  public scrollToBottom(): void {
    if (this.bottomRef.current && this.wrapperRef.current) {
      this.scrollParentToChild(this.wrapperRef.current, this.bottomRef.current);
    }
  }

    /**
   * Scroll to the top
   */
    public scrollToTop(): void {
      if (this.topRef.current && this.wrapperRef.current) {
        this.scrollParentToChild(this.wrapperRef.current, this.topRef.current);
      }
    }

  render(): React.ReactNode {
    const { children, className } = this.props;
    const joinedClassName = styles.scrollableDiv + (className ? " " + className : "");
    return (
      <div className={joinedClassName} ref={this.wrapperRef} onScroll={this.handleScroll}>
        <div ref={this.topRef}></div>
        {children}
        <div ref={this.bottomRef}></div>
      </div>
    );
  }
}

export default ScrollableFeed;
