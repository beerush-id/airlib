import { createLifecycle } from '@anchorlib/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { configureKit, enableLiveObjects, KIT_CONFIGS } from '../src/config.js';

describe('config', () => {
  // Snapshot defaults so we can restore after each test
  const defaults = { ...KIT_CONFIGS };

  beforeEach(() => {
    // Restore defaults before each test
    Object.assign(KIT_CONFIGS, defaults);
  });

  afterEach(() => {
    Object.assign(KIT_CONFIGS, defaults);
  });

  describe('KIT_CONFIGS', () => {
    it('should have correct default values', () => {
      expect(KIT_CONFIGS.autofocus).toBe(true);
      expect(KIT_CONFIGS.trapOverflow).toBe(true);
      expect(KIT_CONFIGS.dialogPortal).toBe('body');
    });
  });

  describe('configureKit', () => {
    it('should update a single config value', () => {
      configureKit({ autofocus: false });
      expect(KIT_CONFIGS.autofocus).toBe(false);
      expect(KIT_CONFIGS.trapOverflow).toBe(true); // unchanged
      expect(KIT_CONFIGS.dialogPortal).toBe('body'); // unchanged
    });

    it('should update multiple config values at once', () => {
      configureKit({ autofocus: false, trapOverflow: false, dialogPortal: '#app' });
      expect(KIT_CONFIGS.autofocus).toBe(false);
      expect(KIT_CONFIGS.trapOverflow).toBe(false);
      expect(KIT_CONFIGS.dialogPortal).toBe('#app');
    });

    it('should allow calling multiple times cumulatively', () => {
      configureKit({ autofocus: false });
      configureKit({ dialogPortal: '#modal-root' });
      expect(KIT_CONFIGS.autofocus).toBe(false);
      expect(KIT_CONFIGS.dialogPortal).toBe('#modal-root');
    });

    it('should overwrite previously set values', () => {
      configureKit({ dialogPortal: '#portal-a' });
      expect(KIT_CONFIGS.dialogPortal).toBe('#portal-a');

      configureKit({ dialogPortal: '#portal-b' });
      expect(KIT_CONFIGS.dialogPortal).toBe('#portal-b');
    });

    it('should accept an empty object without errors', () => {
      configureKit({});
      expect(KIT_CONFIGS.autofocus).toBe(true);
      expect(KIT_CONFIGS.trapOverflow).toBe(true);
      expect(KIT_CONFIGS.dialogPortal).toBe('body');
    });

    it('should enable live objects', () => {
      const scope = createLifecycle();
      const mediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) =>
          ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as any
      );

      scope.run(() => {
        enableLiveObjects();
      });

      expect(mediaSpy).toHaveBeenCalled();

      mediaSpy.mockRestore();
      scope.destroy();
    });
  });
});
