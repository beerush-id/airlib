import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLiveMedia, LiveMedia, MEDIA_SELECTORS, watchMedia } from '../../src/utils/media.js';

describe('media', () => {
  let mediaQueries: Record<string, any> = {};

  beforeEach(() => {
    mediaQueries = {};
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query) => {
        const mq = {
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
        mediaQueries[query] = mq;
        return mq;
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('LiveMedia', () => {
    it('should initialize with current window size', () => {
      const media = new LiveMedia();
      expect(media.width).toBe(1024);
      expect(media.height).toBe(768);
    });
  });

  describe('watchMedia', () => {
    it('should update on resize', () => {
      const dispose = watchMedia();
      const media = getLiveMedia();

      vi.stubGlobal('innerWidth', 800);
      vi.stubGlobal('innerHeight', 600);

      window.dispatchEvent(new Event('resize'));

      expect(media.width).toBe(800);
      expect(media.height).toBe(600);

      dispose();
    });

    it('should listen to matchMedia changes', () => {
      const dispose = watchMedia();
      const media = getLiveMedia();

      expect(media.dark).toBe(false);

      // Simulate change
      const mq = mediaQueries[MEDIA_SELECTORS.dark];
      mq.matches = true;
      const handlerCall = mq.addEventListener.mock.calls.find((call: any) => call[0] === 'change');
      expect(handlerCall).toBeDefined();

      // Invoke change handler
      handlerCall[1]();

      expect(media.dark).toBe(true);

      dispose();
    });

    it('should return the same dispose function when called multiple times', () => {
      const dispose1 = watchMedia();
      const dispose2 = watchMedia();

      expect(dispose1).toBe(dispose2);

      dispose1();
    });
  });
});
