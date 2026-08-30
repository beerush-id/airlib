import type { RemoteState } from '@irpclib/irpc';
import { irpc } from '../module.js';
import type { AIModelOption, ChatConversation, ChatMessage, GenerationRequest, MediaItem } from '../types.js';

// CRUD Stubs
export const mediaCrud = irpc.crud<MediaItem>('media', () => ({
  id: '',
  type: 'image',
  url: '',
  prompt: '',
  model: '',
  modelName: '',
  aspectRatio: '16:9',
  multiplier: '1x',
  createdAt: 0,
  status: 'completed',
}));

export const conversationsCrud = irpc.crud<ChatConversation>('conversations', () => ({
  id: '',
  title: '',
  model: '',
  modelName: '',
  updatedAt: 0,
  messagesCount: 0,
}));

// Specialized Queries & Commands
export const getModels = irpc.declare<() => Promise<AIModelOption[]>>('getModels', () => []);

export const getMediaList = irpc.declare<() => Promise<MediaItem[]>>('getMediaList', () => []);

export const generateMedia = irpc.declare<(req: GenerationRequest) => RemoteState<MediaItem>>('generateMedia', () => ({
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
}));

export const deleteMediaItem = irpc.declare<(id: string) => Promise<void>>('deleteMediaItem', () => undefined);

export const getConversations = irpc.declare<() => Promise<ChatConversation[]>>('getConversations', () => []);

export const createConversation = irpc.declare<(title: string, model: string) => Promise<ChatConversation>>(
  'createConversation',
  () => ({
    id: '',
    title: '',
    model: '',
    modelName: '',
    updatedAt: 0,
    messagesCount: 0,
  })
);

export const deleteConversation = irpc.declare<(id: string) => Promise<void>>('deleteConversation', () => undefined);

export const getMessages = irpc.declare<(conversationId: string) => Promise<ChatMessage[]>>('getMessages', () => []);

export const sendChatMessage = irpc.declare<
  (conversationId: string, content: string, model: string) => RemoteState<ChatMessage>
>('sendChatMessage', () => ({
  id: '',
  conversationId: '',
  role: 'assistant',
  content: '',
  createdAt: 0,
  status: 'pending',
}));
