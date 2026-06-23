import type { StateUnsubscribe } from '@anchorlib/core';
import { impure } from './state.js';

export class LiveDocument {
  public activeElement: HTMLElement | null = null;
}

const currentDoc = impure(new LiveDocument());
let disposeDocument: StateUnsubscribe | null = null;

export function watchDocument() {
  if (disposeDocument) return disposeDocument;

  const handleFocus = (e: FocusEvent) => {
    currentDoc.activeElement = e.target as HTMLElement;
  };
  const handleBlur = () => {
    currentDoc.activeElement = null;
  };

  document.addEventListener('focusin', handleFocus);
  document.addEventListener('focusout', handleBlur);

  disposeDocument = () => {
    document.removeEventListener('focusin', handleFocus);
    document.removeEventListener('focusout', handleBlur);
    disposeDocument = null;
  };

  return disposeDocument;
}

export function getDocument() {
  return currentDoc;
}
