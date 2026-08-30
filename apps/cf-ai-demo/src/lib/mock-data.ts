import type { AIModelOption, ChatConversation, ChatMessage, MediaItem } from './types.js';

export const AI_MODELS: AIModelOption[] = [
  // Image Models
  {
    id: '@cf/black-forest-labs/flux-1-schnell',
    name: 'FLUX.1 Schnell',
    provider: 'Cloudflare Workers AI',
    type: 'image',
    description: 'Ultra fast state-of-the-art diffusion model with exceptional prompt fidelity.',
    credits: 0,
    speed: 'Ultra Fast',
  },
  {
    id: '@cf/bytedance/stable-diffusion-xl-lightning',
    name: 'SDXL Lightning',
    provider: 'Cloudflare Workers AI',
    type: 'image',
    description: 'Sub-second image generation tailored for rapid prototyping and iterative design.',
    credits: 0,
    speed: 'Ultra Fast',
  },
  {
    id: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    name: 'SDXL Base 1.0',
    provider: 'Cloudflare Workers AI',
    type: 'image',
    description: 'High-detail flagship diffusion model for commercial quality imagery.',
    credits: 0,
    speed: 'High Quality',
  },
  // Video Models
  {
    id: '@cf/video/cf-motion-v1',
    name: 'CF Motion Studio v1',
    provider: 'Cloudflare Workers AI',
    type: 'video',
    description: 'Native Cloudflare video generation with frame consistency and smooth cinematic motion.',
    credits: 0,
    speed: 'Balanced',
  },
  {
    id: '@luma/ray-2-720p',
    name: 'Luma Ray 2 (CF Partner)',
    provider: 'Luma AI (CF Partner)',
    type: 'video',
    description: 'Photorealistic world dynamics model capable of complex lighting and camera movements.',
    credits: 0,
    speed: 'High Quality',
  },
  // Chat Models
  {
    id: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Cloudflare Workers AI',
    type: 'chat',
    description: 'Meta flagship reasoning engine running at edge latency with FP8 quantization.',
    credits: 0,
    speed: 'Ultra Fast',
  },
  {
    id: '@cf/meta/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B Instruct',
    provider: 'Cloudflare Workers AI',
    type: 'chat',
    description: 'Compact and high-speed conversational model ideal for instant UI assistance.',
    credits: 0,
    speed: 'Ultra Fast',
  },
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    prompt:
      'Deep Work Vibes — Calm acoustic instrumental scene inside a cozy moody bookstore cafe with warm vintage desk lamps, open notebooks, and acoustic guitar leaning against wooden shelf.',
    model: '@cf/black-forest-labs/flux-1-schnell',
    modelName: 'FLUX.1 Schnell',
    aspectRatio: '16:9',
    multiplier: '1x',
    createdAt: Date.now() - 3600000 * 2,
    status: 'completed',
  },
  {
    id: 'media-2',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    prompt:
      'Late Night Slow Music — Grand piano on a dimly lit wooden stage with golden ambient spotlights, subtle smoke rising from whiskey glass, ultra realistic looping video.',
    model: '@cf/video/cf-motion-v1',
    modelName: 'CF Motion Studio v1',
    aspectRatio: '16:9',
    multiplier: 'x2',
    durationSeconds: 8,
    createdAt: Date.now() - 3600000 * 5,
    status: 'completed',
  },
  {
    id: 'media-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    prompt:
      'Ambient scene rain droplets against rainy window looking out at neon cyberpunk street lights in Tokyo at midnight, moody cinematic color grading.',
    model: '@cf/bytedance/stable-diffusion-xl-lightning',
    modelName: 'SDXL Lightning',
    aspectRatio: '16:9',
    multiplier: '1x',
    createdAt: Date.now() - 3600000 * 12,
    status: 'completed',
  },
  {
    id: 'media-4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518173946687-a4c8a683392e?auto=format&fit=crop&w=800&q=80',
    prompt:
      'Sunny Morning Vibes — Relaxing Bossa Nova patio filled with lush tropical ferns, warm morning sunlight streaming across breakfast table with coffee latte art.',
    model: '@cf/black-forest-labs/flux-1-schnell',
    modelName: 'FLUX.1 Schnell',
    aspectRatio: '4:3',
    multiplier: '1x',
    createdAt: Date.now() - 3600000 * 24,
    status: 'completed',
  },
  {
    id: 'media-5',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    prompt:
      'Aurora Borealis dancing over snow covered Scandinavian mountains under starry night sky, timelapse looping cinematic motion.',
    model: '@luma/ray-2-720p',
    modelName: 'Luma Ray 2',
    aspectRatio: '9:16',
    multiplier: 'x2',
    durationSeconds: 10,
    createdAt: Date.now() - 3600000 * 48,
    status: 'completed',
  },
  {
    id: 'media-6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    prompt:
      'Abstract 3D fluid glass sculpture floating in void with iridescent purple and orange neon lighting, unreal engine 5 render.',
    model: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    modelName: 'SDXL Base 1.0',
    aspectRatio: '1:1',
    multiplier: '1x',
    createdAt: Date.now() - 3600000 * 72,
    status: 'completed',
  },
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    title: 'Cloudflare AIR Stack Architecture Pitch',
    model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    modelName: 'Llama 3.3 70B',
    updatedAt: Date.now() - 1800000,
    messagesCount: 3,
  },
  {
    id: 'conv-2',
    title: 'FLUX.1 Prompt Engineering Ideas',
    model: '@cf/meta/llama-3.1-8b-instruct',
    modelName: 'Llama 3.1 8B',
    updatedAt: Date.now() - 86400000,
    messagesCount: 2,
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      role: 'user',
      content: 'Why should Cloudflare adopt AIR Stack instead of building another React/NextJS wrapper?',
      createdAt: Date.now() - 1800000 - 120000,
      status: 'completed',
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      role: 'assistant',
      content: `Cloudflare Workers are ultra-low latency edge compute instances, but NextJS and traditional React frameworks were built for Node.js servers and heavy DOM reconciliation trees.

**AIR Stack is the missing piece for Cloudflare:**
1. **Zero-Hook Reactivity (Anchor)**: Mutate proxies directly. No \`useEffect\` dependency cascades or re-render overhead.
2. **Isomorphic RPC (IRPC)**: Call server functions directly across workers or browser threads with real-time \`stream()\` support out of the box—perfect for AI streaming without Server Actions boilerplate.
3. **True Edge Native**: Minimal bundle size with zero Node.js polyfill bloat, running effortlessly on Cloudflare Workers and D1.`,
      createdAt: Date.now() - 1800000 - 60000,
      status: 'completed',
    },
  ],
  'conv-2': [
    {
      id: 'msg-3',
      conversationId: 'conv-2',
      role: 'user',
      content: 'Can you give me a great prompt for generating a moody coffee shop scene?',
      createdAt: Date.now() - 86400000 - 60000,
      status: 'completed',
    },
    {
      id: 'msg-4',
      conversationId: 'conv-2',
      role: 'assistant',
      content:
        'Here is a high-fidelity prompt for FLUX.1:\n\n*"Cinematic wide shot inside a cozy rain-streaked coffee shop at dusk. Warm tungsten Edison bulbs reflecting on polished mahogany tables. Steam rising slowly from a ceramic mug beside an open sketchbook. Deep bokeh background showing blurred neon city lights outside the window. 8k, Octane render, photorealistic lighting."*',
      createdAt: Date.now() - 86400000,
      status: 'completed',
    },
  ],
};
