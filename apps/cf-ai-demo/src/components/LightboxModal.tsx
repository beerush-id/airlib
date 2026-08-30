import { mutable, render, setup } from '@airlib/react';
import { getSettings } from '../lib/settings.js';

export const LightboxModal = setup(() => {
  const state = getSettings();
  const local = mutable<{ copied: boolean }>({ copied: false });

  const copyPrompt = (promptText: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(promptText);
      local.copied = true;
      setTimeout(() => {
        local.copied = false;
      }, 2000);
    }
  };

  return render(() => {
    const item = state.lightboxMedia;
    if (!item) return null;

    const isVideo = item.type === 'video';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-fade-in">
        {/* Close Backdrop Click */}
        <div onClick={state.closeLightbox} className="absolute inset-0 cursor-pointer" />

        <div className="relative z-10 w-full max-w-5xl max-h-[90vh] glass-panel rounded-3xl overflow-hidden flex flex-col lg:flex-row border border-white/10 shadow-2xl bg-[#0e1017]">
          {/* Media Container */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[65vh] lg:max-h-full">
            {isVideo ? (
              <video src={item.url} autoPlay loop controls className="max-w-full max-h-full object-contain" />
            ) : (
              <img src={item.url} alt={item.prompt} className="max-w-full max-h-full object-contain" />
            )}
          </div>

          {/* Details Sidebar */}
          <div className="w-full lg:w-80 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-outline bg-surface-container-lowest/80 shrink-0 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#F38020]/20 text-[#F38020] text-xs font-semibold capitalize flex items-center gap-1.5 border border-[#F38020]/30">
                  <span className="air-icon text-sm">{isVideo ? 'videocam' : 'image'}</span>
                  <span>{item.type}</span>
                </span>

                <button
                  onClick={state.closeLightbox}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="air-icon text-base">close</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold tracking-wider block mb-1">
                  Prompt
                </span>
                <p className="text-xs text-white leading-relaxed font-normal bg-surface-container/50 p-3.5 rounded-2xl border border-outline/60 max-h-36 overflow-y-auto">
                  {item.prompt}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-container/40 rounded-xl border border-outline/40 flex flex-col gap-0.5">
                  <span className="text-[10px] text-on-surface-variant">Model</span>
                  <span className="font-semibold text-white truncate" title={item.modelName}>
                    {item.modelName}
                  </span>
                </div>
                <div className="p-3 bg-surface-container/40 rounded-xl border border-outline/40 flex flex-col gap-0.5">
                  <span className="text-[10px] text-on-surface-variant">Aspect Ratio</span>
                  <span className="font-mono text-white">{item.aspectRatio}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-outline/60">
              <button
                onClick={() => copyPrompt(item.prompt)}
                className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-highest text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-outline"
              >
                <span className="air-icon text-sm">{local.copied ? 'check' : 'content_copy'}</span>
                <span>{local.copied ? 'Copied Prompt!' : 'Copy Prompt'}</span>
              </button>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#F38020] hover:opacity-95 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-opacity cursor-pointer shadow-md shadow-[#F38020]/20 no-underline"
              >
                <span className="air-icon text-sm">open_in_new</span>
                <span>Open Raw Asset</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  });
});
