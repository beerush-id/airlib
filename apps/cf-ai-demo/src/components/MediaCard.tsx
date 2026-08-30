import { render, setup, snippet } from '@airlib/react';
import { deleteMediaItem } from '../lib/rpc/index.js';
import { getSettings } from '../lib/settings.js';
import type { MediaItem } from '../lib/types.js';

export const MediaCard = setup<{ item: MediaItem; onRefresh?: () => void }>((props) => {
  const state = getSettings();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!props.item) return;
    await deleteMediaItem(props.item.id);
    props.onRefresh?.();
  };

  // Isolate frequent progress / status updates into a snippet boundary
  const MediaViewerSnippet = snippet(() => {
    const item = props.item;
    if (!item) return null;
    const isVideo = item.type === 'video';

    if (item.status === 'progress' || item.status === 'pending') {
      return (
        <div className="flex flex-col items-center justify-center p-8 w-full min-h-[260px] text-center gap-4 shimmer-bg">
          <div className="w-12 h-12 rounded-full border-2 border-[#F38020] border-t-transparent animate-spin flex items-center justify-center" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Generating {item.type.toUpperCase()}...</span>
            <span className="text-xs text-[#F38020] font-mono">
              {item.progressStep || 'Processing on Cloudflare Workers AI...'}
            </span>
          </div>
          {item.progressPercent ? (
            <div className="w-full max-w-[180px] h-1.5 bg-surface-container rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#F38020] to-[#E6611A] transition-all duration-300"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
          ) : null}
        </div>
      );
    }

    if (isVideo) {
      return (
        <video
          src={item.url}
          poster={item.thumbnailUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
        />
      );
    }

    return (
      <img
        src={item.url}
        alt={item.prompt}
        loading="lazy"
        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
      />
    );
  });

  return render(() => {
    const item = props.item;
    if (!item) return null;
    const isVideo = item.type === 'video';

    return (
      <div
        onClick={() => state.openLightbox(item)}
        className="air-card air-card-outlined air-card-interactive air-masonry-item group p-0 overflow-hidden mb-5"
      >
        <div className="relative w-full overflow-hidden bg-surface-container-lowest flex items-center justify-center min-h-[220px]">
          <MediaViewerSnippet />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
                <span className="air-icon text-xs text-[#F38020]">{isVideo ? 'play_circle' : 'image'}</span>
                <span className="capitalize">{item.type}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-on-surface-variant text-[10px] font-mono border border-white/5">
                {item.aspectRatio}
              </span>
            </div>

            <button
              onClick={handleDelete}
              title="Delete asset"
              className="w-8 h-8 rounded-full bg-black/70 hover:bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-auto cursor-pointer border border-white/10"
            >
              <span className="air-icon text-sm">delete</span>
            </button>
          </div>

          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-1.5">
            <p className="text-xs text-white line-clamp-2 font-normal leading-relaxed">{item.prompt}</p>
            <div className="flex items-center justify-between text-[10px] text-on-surface-variant mt-1">
              <span className="flex items-center gap-1 text-[#F38020]">
                <span className="air-icon text-xs">auto_awesome</span>
                <span>{item.modelName}</span>
              </span>
              <span>{item.multiplier}</span>
            </div>
          </div>
        </div>
      </div>
    );
  });
});
