import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTabState, getTab, setTab, Tab } from '../../src/components/tab/tab.js';

describe('Tab Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Context Management & State Initialization', () => {
    it('should initialize and register tab state into context with default horizontal orientation', () => {
      const tab = createTabState<'overview' | 'settings'>();

      expect(tab.orientation).toBe('horizontal');
      expect(tab.current).toBeUndefined();
      expect(getTab()).toBe(tab);
    });

    it('should initialize tab state with vertical orientation when specified', () => {
      const tab = createTabState({ orientation: 'vertical' });

      expect(tab.orientation).toBe('vertical');
    });

    it('should manually register and retrieve tab instances via setTab and getTab', () => {
      const customTab = new Tab({ orientation: 'vertical' });
      setTab(customTab);

      expect(getTab()).toBe(customTab);
    });
  });

  describe('Tab Activation & Switching', () => {
    it('should update current active tab when activated', () => {
      const tab = createTabState<'home' | 'profile'>();

      tab.activate('home');
      expect(tab.current).toBe('home');
      expect(tab.trigger).toBeUndefined();
      expect(tab.triggerRect).toBeUndefined();

      tab.activate('profile');
      expect(tab.current).toBe('profile');
    });

    it('should record trigger element and bounding rectangle on activation for animated indicators', () => {
      const tab = createTabState<'first' | 'second'>();
      const triggerEl = document.createElement('button');
      container.appendChild(triggerEl);

      const rect = new DOMRect(10, 20, 100, 40);
      tab.activate('second', rect, triggerEl);

      expect(tab.current).toBe('second');
      expect(tab.trigger).toBe(triggerEl);
      expect(tab.triggerRect).toEqual(rect);
    });
  });

  describe('Item Reactive Controller', () => {
    it('should accurately report active state for individual tab items', () => {
      const tab = createTabState<'login' | 'register'>();
      const loginItem = tab.item('login');
      const registerItem = tab.item('register');

      expect(loginItem.active).toBe(false);
      expect(registerItem.active).toBe(false);

      tab.activate('login');
      expect(loginItem.active).toBe(true);
      expect(registerItem.active).toBe(false);

      tab.activate('register');
      expect(loginItem.active).toBe(false);
      expect(registerItem.active).toBe(true);
    });

    it('should activate parent tab state when item controller activates itself', () => {
      const tab = createTabState<'billing' | 'security'>();
      const securityItem = tab.item('security');

      securityItem.activate();
      expect(tab.current).toBe('security');
    });
  });

  describe('Coverage & Edge Cases', () => {
    it('should compute bounding rect when activating item with attached trigger element', () => {
      const tab = createTabState<'tab1'>();
      const btn = document.createElement('button');
      container.appendChild(btn);

      const mockRect = new DOMRect(5, 5, 50, 20);
      btn.getBoundingClientRect = () => mockRect;

      const item = tab.item('tab1');
      item.trigger = btn;
      item.activate();

      expect(tab.current).toBe('tab1');
      expect(tab.trigger).toBe(btn);
      expect(tab.triggerRect).toEqual(mockRect);
    });

    it('should safely handle activation when parent tab reference is missing or optional', () => {
      const tab = createTabState<'test'>();
      const item = tab.item('test');

      // Simulate detached item
      (item as any).tab = undefined;
      expect(() => item.activate()).not.toThrow();
      expect(item.active).toBe(false);
    });
  });
});
