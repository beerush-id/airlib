import { stream } from '@irpclib/irpc';
import { AI_MODELS, INITIAL_CONVERSATIONS, INITIAL_MEDIA_ITEMS, INITIAL_MESSAGES } from '../mock-data.js';
import { irpc } from '../module.js';
import type { ChatConversation, ChatMessage, MediaItem } from '../types.js';
import {
  createConversation,
  deleteConversation,
  deleteMediaItem,
  generateMedia,
  getConversations,
  getMediaList,
  getMessages,
  getModels,
  sendChatMessage,
} from './index.js';

// Memory Stores seeded with rich initial mock data
let memoryMedia: MediaItem[] = [...INITIAL_MEDIA_ITEMS];
let memoryConversations: ChatConversation[] = [...INITIAL_CONVERSATIONS];
const memoryMessages: Record<string, ChatMessage[]> = JSON.parse(JSON.stringify(INITIAL_MESSAGES));

// Sample Output URLs for generation simulations
const MOCK_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80',
];

const MOCK_VIDEO_URLS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
];

irpc.construct(getModels, async () => {
  return AI_MODELS;
});

irpc.construct(getMediaList, async () => {
  return [...memoryMedia].sort((a, b) => b.createdAt - a.createdAt);
});

irpc.construct(deleteMediaItem, async (id) => {
  memoryMedia = memoryMedia.filter((item) => item.id !== id);
});

irpc.construct(generateMedia, (req) => {
  return stream(
    (state, resolve) => {
      const modelInfo = AI_MODELS.find((m) => m.id === req.model) || {
        name: req.model.split('/').pop() || 'FLUX.1 Schnell',
      };

      const newItemId = `media-${Date.now()}`;
      state.data = {
        id: newItemId,
        type: req.type,
        url: '',
        prompt: req.prompt,
        model: req.model,
        modelName: modelInfo.name,
        aspectRatio: req.aspectRatio,
        multiplier: req.multiplier,
        durationSeconds: req.type === 'video' ? 6 : undefined,
        createdAt: Date.now(),
        status: 'progress',
        progressStep: 'Allocating Cloudflare Edge GPU instance...',
        progressPercent: 15,
      };

      const t1 = setTimeout(() => {
        state.data.progressStep = `Encoding prompt embeddings with ${modelInfo.name}...`;
        state.data.progressPercent = 40;
      }, 700);

      const t2 = setTimeout(() => {
        state.data.progressStep =
          req.type === 'video'
            ? 'Rendering temporal video frames (FP8 precision)...'
            : 'Running diffusion steps on high-speed tensor cores...';
        state.data.progressPercent = 75;
      }, 1600);

      const t3 = setTimeout(() => {
        state.data.progressStep = `Finalizing ${req.aspectRatio} output (${req.multiplier} resolution)...`;
        state.data.progressPercent = 92;
      }, 2400);

      const t4 = setTimeout(() => {
        const urls = req.type === 'video' ? MOCK_VIDEO_URLS : MOCK_IMAGE_URLS;
        const pickedUrl = urls[Math.floor(Math.random() * urls.length)];

        state.data.url = pickedUrl;
        state.data.thumbnailUrl = pickedUrl;
        state.data.status = 'completed';
        state.data.progressPercent = 100;
        state.data.progressStep = 'Done';

        memoryMedia.unshift({ ...state.data });
        resolve();
      }, 3200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    },
    {
      id: '',
      type: 'image',
      url: '',
      prompt: '',
      model: '',
      modelName: '',
      aspectRatio: '16:9',
      multiplier: '1x',
      createdAt: 0,
      status: 'pending',
    }
  );
});

irpc.construct(getConversations, async () => {
  return [...memoryConversations].sort((a, b) => b.updatedAt - a.updatedAt);
});

irpc.construct(createConversation, async (title, model) => {
  const modelInfo = AI_MODELS.find((m) => m.id === model) || { name: 'Llama 3.3 70B' };
  const newConv: ChatConversation = {
    id: `conv-${Date.now()}`,
    title: title || 'New AI Session',
    model,
    modelName: modelInfo.name,
    updatedAt: Date.now(),
    messagesCount: 0,
  };
  memoryConversations.unshift(newConv);
  memoryMessages[newConv.id] = [];
  return newConv;
});

irpc.construct(deleteConversation, async (id) => {
  memoryConversations = memoryConversations.filter((c) => c.id !== id);
  delete memoryMessages[id];
});

irpc.construct(getMessages, async (conversationId) => {
  return memoryMessages[conversationId] || [];
});

irpc.construct(sendChatMessage, (conversationId, content, model) => {
  return stream(
    (state, resolve) => {
      if (!memoryMessages[conversationId]) {
        memoryMessages[conversationId] = [];
      }

      // Record user message
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}-u`,
        conversationId,
        role: 'user',
        content,
        createdAt: Date.now(),
        status: 'completed',
      };
      memoryMessages[conversationId].push(userMsg);

      // Prepare assistant response
      const assistantId = `msg-${Date.now()}-a`;
      state.data = {
        id: assistantId,
        conversationId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        status: 'streaming',
      };

      let responseText = `Here is how you can leverage **Cloudflare Workers AI** and the **AIR Stack** for "${content.slice(0, 30)}...":\n\n`;
      if (content.toLowerCase().includes('prompt') || content.toLowerCase().includes('generate')) {
        responseText += `When generating media on edge compute, structuring your prompt with specific lighting and lens parameters boosts fidelity.\n\n**Example Prompt:**\n*\`"Hyper-realistic 8k render, golden hour sunlight reflecting through rain droplets, shallow depth of field, Octane render."\`*\n\nYou can pipe this prompt directly into \`@cf/black-forest-labs/flux-1-schnell\` using Isomorphic RPC with sub-second latency!`;
      } else if (content.toLowerCase().includes('stack') || content.toLowerCase().includes('react')) {
        responseText += `Traditional frameworks rely on heavy virtual DOM reconciliation and manual server actions. By pairing **Anchor Reactivity** with **Isomorphic RPC (IRPC)** on Cloudflare Workers, your UI surgical updates trigger instantly without unnecessary component re-renders.`;
      } else {
        responseText += `I'm running on Cloudflare's edge inference nodes. By streaming tokens directly through Isomorphic RPC, you get zero-latency progressive UI rendering without webhooks or complicated polling mechanisms!`;
      }

      const words = responseText.split(' ');
      let index = 0;

      const interval = setInterval(() => {
        if (index < words.length) {
          state.data.content += (index === 0 ? '' : ' ') + words[index];
          index++;
        } else {
          clearInterval(interval);
          state.data.status = 'completed';
          memoryMessages[conversationId].push({ ...state.data });

          const conv = memoryConversations.find((c) => c.id === conversationId);
          if (conv) {
            conv.updatedAt = Date.now();
            conv.messagesCount = memoryMessages[conversationId].length;
          }

          resolve();
        }
      }, 45);

      return () => clearInterval(interval);
    },
    {
      id: '',
      conversationId,
      role: 'assistant',
      content: '',
      createdAt: 0,
      status: 'pending',
    }
  );
});
