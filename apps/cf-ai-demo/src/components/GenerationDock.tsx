import { $bind, mutable, setup, snippet } from '@airlib/react';
import { AI_MODELS } from '../lib/mock-data.js';
import { generateMedia } from '../lib/rpc/index.js';
import type { AspectRatio, GenerationRequest, MediaType, Multiplier } from '../lib/types.js';
import { InputField } from './InputField.js';
import { SelectField } from './SelectField.js';

export const GenerationDock = setup<{ onCreated?: () => void }>((props) => {
  const form = mutable<{
    type: MediaType;
    prompt: string;
    model: string;
    aspectRatio: AspectRatio;
    multiplier: Multiplier;
    startFrameUrl: string;
    endFrameUrl: string;
    showAdvanced: boolean;
    generating: boolean;
  }>({
    type: 'image',
    prompt: '',
    model: '@cf/black-forest-labs/flux-1-schnell',
    aspectRatio: '16:9',
    multiplier: '1x',
    startFrameUrl: '',
    endFrameUrl: '',
    showAdvanced: false,
    generating: false,
  });

  const aspectRatios: AspectRatio[] = ['16:9', '4:3', '1:1', '3:4', '9:16'];
  const multipliers: Multiplier[] = ['1x', 'x2', 'x3', 'x4'];

  const handleTypeChange = (newType: MediaType) => {
    form.type = newType;
    const firstModel = AI_MODELS.find((m) => m.type === newType);
    if (firstModel) {
      form.model = firstModel.id;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prompt.trim() || form.generating) return;

    form.generating = true;
    const req: GenerationRequest = {
      type: form.type,
      prompt: form.prompt.trim(),
      model: form.model,
      aspectRatio: form.aspectRatio,
      multiplier: form.multiplier,
      startFrameUrl: form.startFrameUrl.trim() || undefined,
      endFrameUrl: form.endFrameUrl.trim() || undefined,
    };

    try {
      const state = generateMedia(req);
      await state;
      form.prompt = '';
      props.onCreated?.();
    } finally {
      form.generating = false;
    }
  };

  // Isolate top control bar (Type, Ratio, Upscale)
  const ControlBarSnippet = snippet(() => (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-outline/80">
      {/* Type Switcher */}
      <div className="flex items-center gap-1 p-1 bg-surface-container/80 rounded-full border border-outline">
        <button
          type="button"
          onClick={() => handleTypeChange('image')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            form.type === 'image' ? 'bg-[#F38020] text-white shadow-sm' : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="air-icon text-sm">image</span>
          <span>Image</span>
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('video')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            form.type === 'video' ? 'bg-[#F38020] text-white shadow-sm' : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="air-icon text-sm">videocam</span>
          <span>Video</span>
        </button>
      </div>

      {/* Aspect Ratio Pills */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mr-1 hidden sm:inline">
          Ratio
        </span>
        {aspectRatios.map((ratio) => (
          <button
            key={ratio}
            type="button"
            onClick={() => {
              form.aspectRatio = ratio;
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
              form.aspectRatio === ratio
                ? 'bg-surface-container-highest text-white border-[#F38020]/50'
                : 'bg-transparent text-on-surface-variant border-transparent hover:bg-surface-container'
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>

      {/* Upscale / Multiplier Pills */}
      <div className="flex items-center gap-1">
        {multipliers.map((mult) => (
          <button
            key={mult}
            type="button"
            onClick={() => {
              form.multiplier = mult;
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
              form.multiplier === mult
                ? 'bg-[#F38020]/20 text-[#F38020] border border-[#F38020]/40 font-semibold'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            {mult}
          </button>
        ))}
      </div>
    </div>
  ));

  // Isolate model picker and advanced toggle
  const ModelSelectorSnippet = snippet(() => {
    const availableModels = AI_MODELS.filter((m) => m.type === form.type);
    return (
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2 flex-1">
          <span className="air-icon text-base text-[#F38020]">tune</span>
          <SelectField
            value={$bind(() => form, 'model')}
            className="bg-surface-container border border-outline rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:border-[#F38020] cursor-pointer max-w-[240px] truncate"
          >
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.speed})
              </option>
            ))}
          </SelectField>
        </div>

        <button
          type="button"
          onClick={() => {
            form.showAdvanced = !form.showAdvanced;
          }}
          className="text-[11px] text-on-surface-variant hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{form.showAdvanced ? 'Hide Frame Inputs' : '+ Frame/Ref URLs'}</span>
          <span className="air-icon text-sm">{form.showAdvanced ? 'expand_less' : 'expand_more'}</span>
        </button>
      </div>
    );
  });

  // Isolate optional frame input fields
  const FrameInputsSnippet = snippet(() =>
    form.showAdvanced ? (
      <div className="air-ai-prompt-attachments bg-surface-container-low rounded-2xl border border-outline mb-3 p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <InputField
            label="Start Frame / Reference Image URL"
            value={$bind(() => form, 'startFrameUrl')}
            placeholder="https://..."
          />
        </div>
        <div className="flex-1">
          <InputField
            label="End Frame URL (Optional Video Target)"
            value={$bind(() => form, 'endFrameUrl')}
            placeholder="https://..."
          />
        </div>
      </div>
    ) : null
  );

  // Isolate frequent prompt typing re-renders
  const PromptFormSnippet = snippet(() => (
    <form onSubmit={handleSubmit} className="air-ai-prompt mt-2 border border-outline">
      <div className="relative w-full">
        <InputField
          value={$bind(() => form, 'prompt')}
          placeholder={`Describe what you want to generate with Cloudflare ${form.type.toUpperCase()}...`}
          className="air-ai-prompt-textarea border-none bg-transparent"
        />
        {form.prompt ? (
          <button
            type="button"
            onClick={() => {
              form.prompt = '';
            }}
            className="absolute right-4 top-4 text-on-surface-variant hover:text-white"
          >
            <span className="air-icon text-base">close</span>
          </button>
        ) : null}
      </div>

      <div className="air-ai-prompt-actions">
        <span className="text-xs text-on-surface-variant flex items-center gap-1">
          <span className="air-ai-sparkle">auto_awesome</span>
          <span>Powered by Workers AI Edge</span>
        </span>
        <button
          type="submit"
          disabled={!form.prompt.trim() || form.generating}
          className={`air-btn ${
            !form.prompt.trim() || form.generating
              ? 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
              : 'air-btn-filled bg-gradient-to-r from-[#F38020] to-[#E6611A] text-white hover:opacity-95'
          }`}
        >
          <span className={`air-icon text-lg ${form.generating ? 'animate-spin' : ''}`}>
            {form.generating ? 'refresh' : 'auto_awesome'}
          </span>
          <span>{form.generating ? 'Edge Generating...' : 'Generate'}</span>
        </button>
      </div>
    </form>
  ));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40">
      <div className="glass-dock rounded-3xl p-4 transition-all duration-300">
        <ControlBarSnippet />
        <ModelSelectorSnippet />
        <FrameInputsSnippet />
        <PromptFormSnippet />
      </div>
    </div>
  );
});
