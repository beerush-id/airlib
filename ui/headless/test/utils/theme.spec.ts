import { describe, expect, it, vi } from 'vitest';
import { colorScheme } from '../../src/utils/theme.js';

describe('theme', () => {
  describe('colorScheme', () => {
    it('should toggle between dark, light, and system', () => {
      const theme = colorScheme();

      theme.change('dark');
      expect(theme.mode).toBe('dark');
      expect(theme.current).toBe('dark');

      theme.toggle();
      expect(theme.mode).toBe('light');
      expect(theme.current).toBe('light');

      theme.toggle();
      expect(theme.mode).toBe('system');
      expect(theme.current).toBeUndefined();

      theme.toggle();
      expect(theme.mode).toBe('dark');
    });

    it('should change mode explicitly', () => {
      const theme = colorScheme();
      theme.change('light');
      expect(theme.mode).toBe('light');
      expect(theme.current).toBe('light');
    });

    it('should return state early if not in browser context', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.stubGlobal('window', undefined);
      vi.resetModules();

      const { colorScheme: colorSchemeSSR } = await import('../../src/utils/theme.js');
      const theme = colorSchemeSSR();

      expect(theme.mode).toBeDefined();
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
      vi.unstubAllGlobals();
    });
  });
});
