/**
 * Temporarily disables scrolling on the nearest scrollable parent element (or the document body)
 * by setting its overflow style to 'hidden'.
 *
 * @param element - The reference element used to find the nearest scrollable parent. If not provided, defaults to document.body.
 * @returns A cleanup function that restores the original overflow style of the affected element.
 */
export function suspendOverflow(element?: HTMLElement) {
  const scrollable = getNearestScrollable(element) ?? document.body;
  const prevOverflow = scrollable.style.overflow;

  scrollable.style.overflow = 'hidden';

  return () => {
    scrollable.style.overflow = prevOverflow;
  };
}

/**
 * Traverses the DOM tree upwards from a starting element to collect all scrollable ancestor elements.
 *
 * @param element - The reference element to begin traversal from.
 * @returns An array of ancestor elements that have vertical scroll overflow.
 */
export function getScrollables(element?: HTMLElement): HTMLElement[] {
  if (!element) return [];
  const result: HTMLElement[] = [];
  let p = getNearestScrollable(element);
  while (p) {
    result.push(p);
    p = getNearestScrollable(p);
  }
  return result;
}

/**
 * Finds the nearest ancestor element that has vertical scroll overflow.
 *
 * @param element - The reference element to search from.
 * @returns The closest scrollable ancestor element, or void if none is found.
 */
export function getNearestScrollable(element?: HTMLElement): HTMLElement | void {
  let parent = element?.parentElement;
  while (parent) {
    if (parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }
}
