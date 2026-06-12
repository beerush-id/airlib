import { describe, expect, it } from 'vitest';
import { stylex } from '../../src/utils/stylex.js';

describe('stylex', () => {
  describe('string values', () => {
    it('should pass through string values unchanged', () => {
      expect(stylex({ width: '100px', color: 'red' })).toEqual({ width: '100px', color: 'red' });
    });

    it('should pass through percentage strings', () => {
      expect(stylex({ width: '50%' })).toEqual({ width: '50%' });
    });

    it('should pass through calc() strings', () => {
      expect(stylex({ width: 'calc(100% - 20px)' })).toEqual({ width: 'calc(100% - 20px)' });
    });
  });

  describe('numeric values', () => {
    it('should append "px" to non-zero numeric values for dimensional properties', () => {
      expect(stylex({ width: 100 })).toEqual({ width: '100px' });
      expect(stylex({ height: 50 })).toEqual({ height: '50px' });
      expect(stylex({ margin: 10 })).toEqual({ margin: '10px' });
      expect(stylex({ padding: 20 })).toEqual({ padding: '20px' });
      expect(stylex({ fontSize: 14 })).toEqual({ fontSize: '14px' });
      expect(stylex({ top: 5 })).toEqual({ top: '5px' });
      expect(stylex({ left: -10 })).toEqual({ left: '-10px' });
    });

    it('should NOT append "px" to zero values', () => {
      expect(stylex({ width: 0 })).toEqual({ width: 0 });
      expect(stylex({ margin: 0 })).toEqual({ margin: 0 });
      expect(stylex({ top: 0 })).toEqual({ top: 0 });
    });

    it('should NOT append "px" to unitless properties', () => {
      expect(stylex({ opacity: 0.5 })).toEqual({ opacity: 0.5 });
      expect(stylex({ zIndex: 10 })).toEqual({ zIndex: 10 });
      expect(stylex({ fontWeight: 700 })).toEqual({ fontWeight: 700 });
      expect(stylex({ lineHeight: 1.5 })).toEqual({ lineHeight: 1.5 });
      expect(stylex({ flex: 1 })).toEqual({ flex: 1 });
      expect(stylex({ flexGrow: 2 })).toEqual({ flexGrow: 2 });
      expect(stylex({ flexShrink: 0 })).toEqual({ flexShrink: 0 });
      expect(stylex({ order: 3 })).toEqual({ order: 3 });
      expect(stylex({ columnCount: 2 })).toEqual({ columnCount: 2 });
      expect(stylex({ animationIterationCount: 5 })).toEqual({ animationIterationCount: 5 });
      expect(stylex({ fillOpacity: 0.8 })).toEqual({ fillOpacity: 0.8 });
      expect(stylex({ tabSize: 4 })).toEqual({ tabSize: 4 });
      expect(stylex({ orphans: 2 })).toEqual({ orphans: 2 });
      expect(stylex({ widows: 2 })).toEqual({ widows: 2 });
    });
  });

  describe('CSS custom properties', () => {
    it('should pass through string custom property values', () => {
      expect(stylex({ '--color-primary': 'blue' })).toEqual({ '--color-primary': 'blue' });
    });

    it('should append "px" to non-zero numeric custom property values', () => {
      expect(stylex({ '--spacing': 16 })).toEqual({ '--spacing': '16px' });
    });

    it('should NOT append "px" to zero custom property values', () => {
      expect(stylex({ '--offset': 0 })).toEqual({ '--offset': 0 });
    });
  });

  describe('null and undefined filtering', () => {
    it('should filter out undefined values', () => {
      expect(stylex({ width: 100, height: undefined })).toEqual({ width: '100px' });
    });

    it('should filter out null values', () => {
      expect(stylex({ width: 100, height: null as any })).toEqual({ width: '100px' });
    });

    it('should keep falsy non-null/undefined values (0, empty string)', () => {
      expect(stylex({ width: 0, height: '' })).toEqual({ width: 0, height: '' });
    });
  });

  describe('function provider', () => {
    it('should resolve a function provider and process its return value', () => {
      const result = stylex(() => ({ width: 100, color: 'red' }));
      expect(result).toEqual({ width: '100px', color: 'red' });
    });

    it('should handle function returning empty object', () => {
      expect(stylex(() => ({}))).toEqual({});
    });

    it('should handle function returning values with null/undefined', () => {
      const result = stylex(() => ({ width: 100, height: undefined, top: null as any }));
      expect(result).toEqual({ width: '100px' });
    });
  });

  describe('empty input', () => {
    it('should return empty object for empty input', () => {
      expect(stylex({})).toEqual({});
    });
  });

  describe('mixed scenario', () => {
    it('should handle a realistic mixed style object', () => {
      const result = stylex({
        width: 200,
        height: 100,
        opacity: 0.8,
        zIndex: 5,
        color: 'blue',
        margin: 0,
        padding: 16,
        '--gap': 8,
        display: undefined,
      });
      expect(result).toEqual({
        width: '200px',
        height: '100px',
        opacity: 0.8,
        zIndex: 5,
        color: 'blue',
        margin: 0,
        padding: '16px',
        '--gap': '8px',
      });
    });
  });
});
