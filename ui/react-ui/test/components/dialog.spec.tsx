import { createDialogState } from '@airlib/headless';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { Dialog } from '../../src/index.js';

describe('Dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('should render hidden by default', () => {
    const state = createDialogState({ data: null });
    render(
      <Dialog dialog={state}>
        <p>Content</p>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have aria-labelledby via aria-labelledby attribute', () => {
    const state = createDialogState({ data: null });
    render(
      <Dialog dialog={state} aria-labelledby="my-title">
        <h2 id="my-title">Title</h2>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog.getAttribute('aria-labelledby')).toBe('my-title');
  });

  it('should render open when state is open', () => {
    const state = createDialogState({ data: null, open: true });
    render(
      <Dialog dialog={state}>
        <p>Content</p>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.hidden).toBeFalsy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('should not render in lazy mode when closed', () => {
    const state = createDialogState({ data: null });
    render(
      <Dialog dialog={state} renderMode="lazy">
        <p>Content</p>
      </Dialog>
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('should render in lazy mode when open', () => {
    const state = createDialogState({ data: null, open: true });
    render(
      <Dialog dialog={state} renderMode="lazy">
        <p>Content</p>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.hidden).toBeFalsy();
  });
});
