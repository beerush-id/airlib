import { setup, snippet } from '@airlib/react';
import { getSettings } from '../lib/settings.js';
import type { MediaType } from '../lib/types.js';

export const Sidebar = setup(() => {
  const state = getSettings();

  const navItems: Array<{ id: 'all' | MediaType; label: string; icon: string }> = [
    { id: 'all', label: 'All Media', icon: 'grid_view' },
    { id: 'image', label: 'Images', icon: 'image' },
    { id: 'video', label: 'Videos', icon: 'videocam' },
  ];

  // Isolate category switcher re-renders into a snippet
  const NavItemsSnippet = snippet(() => (
    <>
      {navItems.map((item) => {
        const isActive = state.activeCategory === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              state.activeCategory = item.id;
            }}
            title={item.label}
            className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer mx-auto ${
              isActive
                ? 'bg-[#F38020] text-white shadow-lg shadow-[#F38020]/25 scale-105 font-medium'
                : 'text-on-surface-variant hover:text-white hover:bg-surface-container'
            }`}
          >
            <span className="air-icon text-xl">{item.icon}</span>
            <span className="text-[9px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </>
  ));

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-16 glass-panel flex flex-col items-center py-6 gap-6 z-30 border-r border-outline">
      {/* Category Nav Items */}
      <div className="flex flex-col gap-3 w-full px-2">
        <NavItemsSnippet />
      </div>

      <div className="w-8 h-[1px] bg-outline my-2" />

      {/* Extra tools / pitch features */}
      <div className="flex flex-col gap-3 w-full px-2">
        <button
          onClick={() => {
            state.openChat();
          }}
          title="Workers AI Prompt Assistant"
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container transition-all cursor-pointer mx-auto"
        >
          <span className="air-icon text-xl">smart_toy</span>
          <span className="text-[9px] mt-0.5">Prompt</span>
        </button>

        <button
          onClick={() => {
            state.toggleDriver();
          }}
          title="Edge Architecture Specs"
          className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container transition-all cursor-pointer mx-auto"
        >
          <span className="air-icon text-xl">cloud</span>
          <span className="text-[9px] mt-0.5">Edge</span>
        </button>
      </div>
    </aside>
  );
});
