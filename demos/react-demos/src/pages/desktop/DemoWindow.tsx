import { Window, WindowToolbar } from '@airlib/react-ui';
import { SearchIcon } from '@airlib/react-ui/icons';
import type { WebWindowRenderer } from '@airlib/uikit';

export const DemoWindow: WebWindowRenderer<any, any> = () => (
  <Window headless title="Asset Browser">
    <WindowToolbar>
      <div className="flex-1 flex items-center gap-4 px-4 py-3">
        <div className="air-split-button-group air-split-button-tonal">
          <button className="air-split-button-primary">Talents</button>
          <button className="air-split-button-trailing">
            <span className="material-symbols-outlined">arrow_drop_down</span>
          </button>
        </div>

        <div className="air-search-bar air-search-bar-surface flex-1">
          <SearchIcon className="air-icon" />
          <input className="air-search-bar-input" placeholder="Search assets" />
        </div>

        <div className="air-split-button-group air-split-button-tonal">
          <button className="air-split-button-primary">Recent</button>
          <button className="air-split-button-trailing">
            <span className="material-symbols-outlined">arrow_drop_down</span>
          </button>
        </div>
      </div>
    </WindowToolbar>
    <div className="flex flex-col w-full max-w-5xl h-[600px] overflow-hidden">
      {/* Top Bar */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-56 flex flex-col px-4">
          <div className="air-list-view flex-1 flex flex-col gap-1 overflow-y-auto">
            <button role="option" className="air-list-view-item air-list-view-item-filled" aria-selected="true">
              <span className="material-symbols-outlined">grid_view</span>
              <span className="air-list-view-item-content">All</span>
            </button>
            <button className="air-list-view-item air-list-view-item-filled">
              <span className="material-symbols-outlined">image</span>
              <span className="air-list-view-item-content">Images</span>
            </button>
            <button className="air-list-view-item air-list-view-item-filled">
              <span className="material-symbols-outlined">videocam</span>
              <span className="air-list-view-item-content">Videos</span>
            </button>
            <button className="air-list-view-item air-list-view-item-filled">
              <span className="material-symbols-outlined">mic</span>
              <span className="air-list-view-item-content">Voices</span>
            </button>
            <button className="air-list-view-item air-list-view-item-filled">
              <span className="material-symbols-outlined">person</span>
              <span className="air-list-view-item-content">Characters</span>
            </button>
            <button className="air-list-view-item air-list-view-item-filled">
              <span className="material-symbols-outlined">face</span>
              <span className="air-list-view-item-content">Avatar</span>
            </button>
            <button className="air-list-view-item air-list-view-item-filled">
              <span className="material-symbols-outlined">upload_file</span>
              <span className="air-list-view-item-content">Uploads</span>
            </button>
          </div>
          <div className="mb-4 mt-2">
            <button className="air-button-text w-full justify-start">
              <span className="material-symbols-outlined">upload</span>
              Upload media
            </button>
          </div>
        </div>

        {/* Middle List */}
        <div className="air-list-view w-80 flex flex-col overflow-y-auto gap-1">
          <button className="air-list-view-item air-list-view-item-filled">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </div>
            <div className="air-list-view-item-content min-w-0">
              <span className="air-body-lg truncate font-medium">Woman in Javanese atti...</span>
              <span className="air-list-view-item-supporting-text truncate">Image</span>
            </div>
          </button>

          <button role="option" className="air-list-view-item air-list-view-item-filled" aria-selected="true">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
            </div>
            <div className="air-list-view-item-content min-w-0">
              <span className="air-body-lg truncate">Woman walking toward...</span>
              <span className="air-list-view-item-supporting-text truncate">Video</span>
            </div>
          </button>

          <button className="air-list-view-item air-list-view-item-filled">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
            </div>
            <div className="air-list-view-item-content min-w-0">
              <span className="air-body-lg truncate">Woman walking toward...</span>
              <span className="air-list-view-item-supporting-text truncate">Video</span>
            </div>
          </button>

          <button className="air-list-view-item air-list-view-item-filled">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
            </div>
            <div className="air-list-view-item-content min-w-0">
              <span className="air-body-lg truncate">Woman walking toward...</span>
              <span className="air-list-view-item-supporting-text truncate">Video</span>
            </div>
          </button>

          <button className="air-list-view-item air-list-view-item-filled">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
            </div>
            <div className="air-list-view-item-content min-w-0">
              <span className="air-body-lg truncate">Woman walking toward...</span>
              <span className="air-list-view-item-supporting-text truncate">Video</span>
            </div>
          </button>

          <button className="air-list-view-item air-list-view-item-filled">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">image</span>
            </div>
            <div className="air-list-view-item-content min-w-0">
              <span className="air-body-lg truncate">Woman walking on Java...</span>
              <span className="air-list-view-item-supporting-text truncate">Image</span>
            </div>
          </button>
        </div>

        {/* Right Preview */}
        <div className="flex-1 flex flex-col relative p-4 pt-0 gap-4">
          <div className="air-card-filled flex-1 overflow-hidden">
            <img src="/images/image-1.png" alt="preview" className="w-full h-full object-cover object-center" />
          </div>

          <button className="air-button air-button-filled w-full max-w-sm">Add to Prompt</button>
        </div>
      </div>
    </div>
  </Window>
);

export default DemoWindow;
