import { mutable, render, setup } from '@airlib/react';
import { getMediaList } from '../lib/rpc/index.js';
import { getSettings } from '../lib/settings.js';
import type { MediaItem } from '../lib/types.js';
import { MediaCard } from './MediaCard.js';

export const MediaGallery = setup<{ refreshSignal?: number }>((props) => {
  const state = getSettings();
  const galleryState = mutable<{ items: MediaItem[]; loading: boolean }>({
    items: [],
    loading: true,
  });

  const fetchItems = async () => {
    galleryState.loading = true;
    try {
      const list = await getMediaList();
      galleryState.items = (list || []) as any;
    } finally {
      galleryState.loading = false;
    }
  };

  fetchItems();

  return render(() => {
    // Re-trigger fetch when refreshSignal changes if passed
    const _sig = props.refreshSignal;

    const filtered = galleryState.items.filter((item) => {
      if (state.activeCategory !== 'all' && item.type !== state.activeCategory) {
        return false;
      }
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        return (
          item.prompt.toLowerCase().includes(q) ||
          item.modelName.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return (
      <main className="pl-24 pr-8 pt-24 pb-36 min-h-screen w-full max-w-7xl mx-auto">
        {/* Gallery Title Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Cloudflare AI Media Showcase</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container font-sans text-on-surface-variant font-normal">
                {filtered.length} {filtered.length === 1 ? 'creation' : 'creations'}
              </span>
            </h1>
            <p className="text-sm text-on-surface-variant font-light mt-1">
              Real-time diffusion & motion studio running on Cloudflare Workers edge nodes.
            </p>
          </div>

          <button
            onClick={fetchItems}
            title="Refresh gallery"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-xs text-on-surface-variant hover:text-white transition-colors cursor-pointer border border-outline"
          >
            <span className={`air-icon text-sm ${galleryState.loading ? 'animate-spin' : ''}`}>refresh</span>
            <span>Refresh</span>
          </button>
        </div>

        {/* Masonry Grid */}
        {galleryState.loading && galleryState.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-on-surface-variant">
            <div className="w-8 h-8 rounded-full border-2 border-[#F38020] border-t-transparent animate-spin" />
            <span className="text-sm">Loading edge assets...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-3xl border border-outline text-center px-6 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-4">
              <span className="air-icon text-3xl">auto_awesome_mosaic</span>
            </div>
            <h3 className="text-lg font-semibold text-white">No creations found</h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-sm leading-relaxed">
              Use the floating dock below or open the AI assistant drawer to start generating stunning visuals with
              Cloudflare Workers AI.
            </p>
          </div>
        ) : (
          <div className="air-masonry">
            {filtered.map((item) => (
              <MediaCard key={item.id} item={item} onRefresh={fetchItems} />
            ))}
          </div>
        )}
      </main>
    );
  });
});
