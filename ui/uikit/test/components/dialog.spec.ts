import { clearContextStore } from '@anchorlib/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDialog, getDialog, setDialog } from '../../src/index.js';

let container: HTMLElement | undefined;

describe('createDialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    clearContextStore();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container?.remove();
    container = undefined;
  });

  describe('state', () => {
    it('should default to closed', () => {
      const dialog = createDialog();
      expect(dialog.open).toBe(false);
    });

    it('should accept custom initial state', () => {
      const dialog = createDialog({ open: true });
      expect(dialog.open).toBe(true);
    });

    it('should open via openDialog()', () => {
      const dialog = createDialog();
      dialog.show();
      expect(dialog.open).toBe(true);
    });

    it('should close via closeDialog()', () => {
      const dialog = createDialog({ open: true });
      dialog.hide();
      expect(dialog.open).toBe(false);
    });
  });

  describe('scroll lock', () => {
    it('should lock body scroll when opened', () => {
      const dialog = createDialog({ container });
      dialog.show();

      expect(document.body.style.overflow).toBe('hidden');

      dialog.hide();
    });

    it('should restore body scroll when closed', () => {
      document.body.style.overflow = 'auto';
      const dialog = createDialog({ container });

      dialog.show();
      expect(document.body.style.overflow).toBe('hidden');

      dialog.hide();
      expect(document.body.style.overflow).toBe('auto');
    });
  });

  describe('refs', () => {
    it('should expose container as undefined by default', () => {
      const dialog = createDialog();
      expect(dialog.container).toBeUndefined();
    });
  });

  describe('context', () => {
    it('should set context on creation', () => {
      const dialog = createDialog();
      setDialog(dialog);

      const retrieved = getDialog();
      expect(retrieved).toBeDefined();
      expect(retrieved?.open).toBe(false);
    });
  });
});
