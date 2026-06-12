/**
 * Temporarily disables scrolling on the nearest scrollable parent element (or the document body)
 * by setting its overflow style to 'hidden'.
 *
 * @param element - The reference element used to find the nearest scrollable parent. If not provided, defaults to document.body.
 * @returns A cleanup function that restores the original overflow style of the affected element.
 */
export function suspendOverflow(element?: HTMLElement) {
  const scrollable = getNearestScrollableParent(element) ?? document.body;
  const prevOverflow = scrollable.style.overflow;

  scrollable.style.overflow = 'hidden';

  return () => {
    scrollable.style.overflow = prevOverflow;
  };
}

export function getNearestScrollableParent(element?: HTMLElement): HTMLElement | void {
  let parent = element?.parentElement;
  while (parent) {
    if (parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }
}
