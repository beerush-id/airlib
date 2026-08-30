export type MediaType = 'image' | 'video';

export type AspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

export type Multiplier = '1x' | 'x2' | 'x3' | 'x4';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  prompt: string;
  model: string;
  modelName: string;
  aspectRatio: AspectRatio;
  multiplier: Multiplier;
  durationSeconds?: number;
  createdAt: number;
  status: 'pending' | 'progress' | 'completed' | 'failed';
  progressStep?: string;
  progressPercent?: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  model: string;
  modelName: string;
  updatedAt: number;
  messagesCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  attachmentUrl?: string;
  createdAt: number;
  status: 'pending' | 'streaming' | 'completed' | 'error';
}

export interface AIModelOption {
  id: string;
  name: string;
  provider: 'Cloudflare Workers AI' | 'Luma AI (CF Partner)' | 'Stability AI';
  type: 'image' | 'video' | 'chat';
  description: string;
  credits: number;
  speed: 'Ultra Fast' | 'Balanced' | 'High Quality';
}

export interface GenerationRequest {
  type: MediaType;
  prompt: string;
  model: string;
  aspectRatio: AspectRatio;
  multiplier: Multiplier;
  startFrameUrl?: string;
  endFrameUrl?: string;
}
