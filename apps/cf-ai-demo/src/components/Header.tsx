import { $bind, setup, snippet } from '@airlib/react';
import { getSettings } from '../lib/settings.js';
import { InputField } from './InputField.js';

export const Header = setup(() => {
  const state = getSettings();

  // Isolate frequent keystroke re-renders to just this snippet
  const SearchInputSnippet = snippet(() => (
    <div className="relative w-full">
      <span className="air-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg z-10 pointer-events-none">
        search
      </span>
      <InputField
        value={$bind(() => state, 'searchQuery')}
        placeholder="Search prompts, models, or media..."
        className="w-full pl-10 pr-4 py-2 bg-surface-container/60 border border-outline rounded-full text-sm text-white placeholder-on-surface-variant focus:outline-none focus:border-[#F38020] transition-colors"
      />
      {state.searchQuery ? (
        <button
          onClick={() => {
            state.searchQuery = '';
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
        >
          <span className="air-icon text-base">close</span>
        </button>
      ) : null}
    </div>
  ));

  // Isolate driver toggle button state to just this snippet
  const DriverToggleSnippet = snippet(() => (
    <button
      onClick={state.toggleDriver}
      title="Switch between realistic mock driver and Cloudflare Workers AI edge execution"
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
        state.driver === 'cloudflare'
          ? 'bg-[#F38020]/15 border-[#F38020]/40 text-[#F38020] shadow-sm shadow-[#F38020]/10'
          : 'bg-surface-container border-outline text-on-surface-variant hover:text-white'
      }`}
    >
      <span className="air-icon text-sm">{state.driver === 'cloudflare' ? 'bolt' : 'science'}</span>
      <span>{state.driver === 'cloudflare' ? 'Driver: Cloudflare Edge AI' : 'Driver: Mock Simulator'}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-subtle" />
    </button>
  ));

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 glass-panel px-6 flex items-center justify-between border-b border-outline">
      {/* Brand & Pitch Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#F38020] to-[#E6611A] text-white shadow-lg shadow-[#F38020]/20">
          <span className="air-icon text-2xl">auto_awesome</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg tracking-tight text-white">Cloudflare AI Studio</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F38020]/15 text-[#F38020] border border-[#F38020]/30 tracking-wide uppercase">
              AIR Stack Edge
            </span>
          </div>
          <span className="text-xs text-on-surface-variant font-light">
            Powered by Workers AI + Isomorphic RPC + Anchor
          </span>
        </div>
      </div>

      {/* Search Input Area */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <SearchInputSnippet />
      </div>

      {/* Driver Toggle & Actions */}
      <div className="flex items-center gap-3">
        <DriverToggleSnippet />

        <button
          onClick={() => state.openChat()}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F38020] to-[#E6611A] text-white text-xs font-semibold hover:opacity-95 transition-all shadow-md shadow-[#F38020]/20 cursor-pointer"
        >
          <span className="air-icon text-base">chat</span>
          <span>AI Assistant</span>
        </button>
      </div>
    </header>
  );
});
