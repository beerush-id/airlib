import { clearContextStore, createLifecycle } from '@anchorlib/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDialog, DialogState, getDialog, setDialog } from '../../src/index.js';

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

    it('should open via show()', () => {
      const dialog = createDialog();
      dialog.show();
      expect(dialog.open).toBe(true);
    });

    it('should close via hide()', () => {
      const dialog = createDialog({ open: true });
      dialog.hide();
      expect(dialog.open).toBe(false);
    });
  });

  describe('data', () => {
    it('should return undefined when no data is provided', () => {
      const dialog = createDialog();
      expect(dialog.data).toBeUndefined();
    });

    it('should return static data', () => {
      const dialog = createDialog({ data: { id: 1 } });
      expect(dialog.data).toEqual({ id: 1 });
    });

    it('should call function data each time it is accessed', () => {
      let count = 0;
      const dialog = createDialog({ data: () => ++count });
      expect(dialog.data).toBe(1);
      expect(dialog.data).toBe(2);
    });

    it('should override data when show() is called with data', () => {
      const dialog = createDialog<string, void>({ data: 'initial' });
      expect(dialog.data).toBe('initial');

      dialog.show('updated');
      expect(dialog.data).toBe('updated');

      dialog.hide();
    });
  });

  describe('container', () => {
    it('should expose container as undefined by default', () => {
      const dialog = createDialog();
      expect(dialog.container).toBeUndefined();
    });

    it('should accept container via init', () => {
      const dialog = createDialog({ container });
      expect(dialog.container).toBe(container);
    });

    it('should allow setting container after creation', () => {
      const dialog = createDialog();
      dialog.container = container;
      expect(dialog.container).toBe(container);
    });

    it('should allow replacing container', () => {
      const dialog = createDialog({ container });
      const newContainer = document.createElement('div');
      dialog.container = newContainer;
      expect(dialog.container).toBe(newContainer);
    });

    it('should close on mouseup outside the container', () => {
      const handler = vi.fn();
      const dialog = createDialog({ container }, { onRelease: handler });
      dialog.show();
      expect(dialog.open).toBe(true);

      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(dialog.open).toBe(false);
      expect(handler).toHaveBeenCalled();
    });

    it('should NOT close on mouseup inside the container', () => {
      const dialog = createDialog({ container });
      dialog.show();
      expect(dialog.open).toBe(true);

      container!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(dialog.open).toBe(true);

      dialog.hide();
    });

    it('should close on Escape key', () => {
      const dialog = createDialog({ container });
      dialog.show();
      expect(dialog.open).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(dialog.open).toBe(false);
    });

    it('should NOT close on non-Escape keys', () => {
      const dialog = createDialog({ container });
      dialog.show();
      expect(dialog.open).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(dialog.open).toBe(true);

      dialog.hide();
    });

    it('should close on lifecycle destroy', () => {
      const scope = createLifecycle();
      let dialog: DialogState<void, string> | undefined;

      scope.run(() => {
        dialog = createDialog({ container });
        dialog.show();
      });

      expect(dialog?.open).toBe(true);

      scope.destroy();

      expect(dialog?.open).toBe(false);
    });
  });

  describe('promise resolution', () => {
    it('should resolve the show() promise when hide() is called with a value', async () => {
      const dialog = createDialog<void, string>();
      const promise = dialog.show();
      dialog.hide('result');
      await expect(promise).resolves.toBe('result');
    });

    it('should resolve with undefined when hide() is called without arguments', async () => {
      const dialog = createDialog<void, string>();
      const promise = dialog.show();
      dialog.hide();
      await expect(promise).resolves.toBeUndefined();
    });

    it('should reject the show() promise when hide() is called with an Error', async () => {
      const dialog = createDialog<void, string>();
      const promise = dialog.show();
      const error = new Error('cancelled');
      dialog.hide(error);
      await expect(promise).rejects.toThrow('cancelled');
    });

    it('should return the same promise when show() is called multiple times while open', () => {
      const dialog = createDialog<void, void>();
      const p1 = dialog.show();
      const p2 = dialog.show();
      expect(p1).toBe(p2);
      dialog.hide();
    });
  });

  describe('hide() idempotency', () => {
    it('should be a no-op when called a second time', async () => {
      const dialog = createDialog<void, number>();
      const promise = dialog.show();
      dialog.hide(42);
      // Second hide should be a no-op
      dialog.hide(99);
      await expect(promise).resolves.toBe(42);
    });

    it('should return the dialog instance for chaining', () => {
      const dialog = createDialog({ open: true });
      const result = dialog.hide();
      expect(result).toBe(dialog);
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

  describe('context', () => {
    it('should set context on creation', () => {
      const dialog = createDialog();
      setDialog(dialog);

      const retrieved = getDialog();
      expect(retrieved).toBeDefined();
      expect(retrieved?.open).toBe(false);
    });

    it('should return undefined when no context is set', () => {
      const retrieved = getDialog();
      expect(retrieved).toBeUndefined();
    });

    it('should retrieve the same dialog instance that was set', () => {
      const dialog = createDialog<string, number>({ data: 'hello' });
      setDialog(dialog);

      const retrieved = getDialog<string, number>();
      expect(retrieved).toBe(dialog);
      expect(retrieved?.data).toBe('hello');
    });
  });

  describe('DialogState class', () => {
    it('should be exported as a named class', () => {
      expect(DialogState).toBeDefined();
      expect(typeof DialogState).toBe('function');
    });

    it('should create an instance directly', () => {
      const dialog = new DialogState({ open: false });
      expect(dialog.open).toBe(false);
    });
  });
});
