import { getContext, setContext } from '@airlib/core';
import { mutable } from '@airlib/react';
import type { MediaItem, MediaType } from './types.js';

export type DriverMode = 'mock' | 'cloudflare';

export interface AppState {
  theme: 'dark' | 'light';
  driver: DriverMode;
  activeCategory: 'all' | MediaType;
  searchQuery: string;
  chatDrawerOpen: boolean;
  activeConversationId: string | null;
  lightboxMedia: MediaItem | null;
  toggleTheme(): void;
  toggleDriver(): void;
  openChat(conversationId?: string): void;
  closeChat(): void;
  openLightbox(item: MediaItem): void;
  closeLightbox(): void;
}

export const APP_STATE_KEY = Symbol('app-state');

export function createSettings(): AppState {
  const state = mutable<AppState>({
    theme: 'dark',
    driver: 'mock',
    activeCategory: 'all',
    searchQuery: '',
    chatDrawerOpen: false,
    activeConversationId: 'conv-1',
    lightboxMedia: null,
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    },
    toggleDriver() {
      this.driver = this.driver === 'mock' ? 'cloudflare' : 'mock';
    },
    openChat(conversationId?: string) {
      if (conversationId) {
        this.activeConversationId = conversationId;
      }
      this.chatDrawerOpen = true;
    },
    closeChat() {
      this.chatDrawerOpen = false;
    },
    openLightbox(item: MediaItem) {
      this.lightboxMedia = item;
    },
    closeLightbox() {
      this.lightboxMedia = null;
    },
  });

  setContext(APP_STATE_KEY, state);
  return state;
}

export function getSettings(): AppState {
  return getContext<AppState>(APP_STATE_KEY);
}
