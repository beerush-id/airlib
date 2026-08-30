import { $bind, mutable, render, setup, snippet } from '@airlib/react';
import { AI_MODELS } from '../lib/mock-data.js';
import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  sendChatMessage,
} from '../lib/rpc/index.js';
import { getSettings } from '../lib/settings.js';
import type { ChatConversation, ChatMessage } from '../lib/types.js';
import { InputField } from './InputField.js';
import { SelectField } from './SelectField.js';

export const ChatDrawer = setup(() => {
  const state = getSettings();
  const chatStore = mutable<{
    conversations: ChatConversation[];
    messages: ChatMessage[];
    input: string;
    model: string;
    loadingMessages: boolean;
    sending: boolean;
    showSessionList: boolean;
  }>({
    conversations: [],
    messages: [],
    input: '',
    model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    loadingMessages: false,
    sending: false,
    showSessionList: false,
  });

  const chatModels = AI_MODELS.filter((m) => m.type === 'chat');

  const fetchConversations = async () => {
    const list = await getConversations();
    chatStore.conversations = (list || []) as any;
    if (!state.activeConversationId && list.length > 0) {
      state.activeConversationId = list[0].id;
    }
  };

  const fetchMessages = async () => {
    if (!state.activeConversationId) {
      chatStore.messages = [];
      return;
    }
    chatStore.loadingMessages = true;
    try {
      const msgs = await getMessages(state.activeConversationId);
      chatStore.messages = (msgs || []) as any;
    } finally {
      chatStore.loadingMessages = false;
    }
  };

  const handleNewSession = async () => {
    const conv = await createConversation('New AI Conversation', chatStore.model);
    await fetchConversations();
    state.activeConversationId = conv.id;
    chatStore.showSessionList = false;
    await fetchMessages();
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteConversation(id);
    if (state.activeConversationId === id) {
      state.activeConversationId = null;
    }
    await fetchConversations();
    await fetchMessages();
  };

  const handleSelectSession = async (id: string) => {
    state.activeConversationId = id;
    chatStore.showSessionList = false;
    await fetchMessages();
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatStore.input.trim() || chatStore.sending || !state.activeConversationId) return;

    const content = chatStore.input.trim();
    chatStore.input = '';
    chatStore.sending = true;

    try {
      const streamState = sendChatMessage(state.activeConversationId, content, chatStore.model);
      await fetchMessages(); // immediately reflect user message
      await streamState;
      await fetchMessages(); // reflect completed assistant message
    } finally {
      chatStore.sending = false;
    }
  };

  fetchConversations();
  fetchMessages();

  // Isolate header toggle buttons
  const DrawerHeaderSnippet = snippet(() => (
    <div className="h-16 px-6 flex items-center justify-between border-b border-outline shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            chatStore.showSessionList = !chatStore.showSessionList;
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-xs font-semibold text-white transition-all cursor-pointer border border-outline"
        >
          <span className="air-icon text-sm text-[#F38020]">forum</span>
          <span>{chatStore.showSessionList ? 'Hide Sessions' : 'Session list'}</span>
          <span className="air-icon text-xs">{chatStore.showSessionList ? 'expand_less' : 'expand_more'}</span>
        </button>

        <button
          onClick={handleNewSession}
          title="Create new conversation"
          className="w-8 h-8 rounded-xl bg-[#F38020]/20 hover:bg-[#F38020] text-[#F38020] hover:text-white flex items-center justify-center transition-all cursor-pointer border border-[#F38020]/30"
        >
          <span className="air-icon text-base">add</span>
        </button>
      </div>

      <button
        onClick={state.closeChat}
        className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <span className="air-icon text-base">close</span>
      </button>
    </div>
  ));

  // Isolate live streaming message area
  const DrawerBodySnippet = snippet(() => {
    const activeConv = chatStore.conversations.find((c) => c.id === state.activeConversationId);
    return (
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {chatStore.showSessionList ? (
          /* Sessions List View */
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Historical Sessions ({chatStore.conversations.length})
            </span>
            {chatStore.conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectSession(c.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  c.id === state.activeConversationId
                    ? 'bg-[#F38020]/15 border-[#F38020]/40 text-white'
                    : 'bg-surface-container/60 border-outline hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex flex-col gap-1 truncate pr-2">
                  <span className="text-sm font-medium truncate">{c.title}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {c.modelName} · {c.messagesCount} msgs
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(e, c.id)}
                  className="w-7 h-7 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-on-surface-variant flex items-center justify-center shrink-0"
                >
                  <span className="air-icon text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        ) : !state.activeConversationId ? (
          /* Welcome State */
          <div className="flex flex-col items-center justify-center flex-1 text-center py-12 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#F38020]/20 text-[#F38020] flex items-center justify-center">
              <span className="air-icon text-4xl">smart_toy</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Workers AI Assistant</h3>
              <p className="text-xs text-on-surface-variant mt-1 max-w-xs leading-relaxed">
                Ask questions about prompt engineering, FLUX.1 models, or how AIR Stack achieves zero-hook fine-grained
                reactivity on Cloudflare.
              </p>
            </div>
            <button
              onClick={handleNewSession}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F38020] to-[#E6611A] text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-[#F38020]/20 cursor-pointer"
            >
              Start New Session
            </button>
          </div>
        ) : (
          /* Thread Messages */
          <div className="flex flex-col gap-4">
            {activeConv ? (
              <div className="flex items-center justify-between pb-3 border-b border-outline/50 text-xs text-on-surface-variant">
                <span className="font-semibold text-white">{activeConv.title}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container">
                  {activeConv.modelName}
                </span>
              </div>
            ) : null}

            {chatStore.messages.length === 0 ? (
              <div className="flex flex-col gap-3 py-6">
                <span className="text-xs text-on-surface-variant font-light text-center">
                  Quick Suggestions to get started:
                </span>
                {[
                  'Why should Cloudflare adopt AIR Stack instead of building another React/NextJS wrapper?',
                  'Can you give me a great prompt for generating a moody coffee shop scene?',
                  'How does Isomorphic RPC stream tokens from Workers AI without Server Actions?',
                ].map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      chatStore.input = sug;
                      handleSend();
                    }}
                    className="p-3 text-left text-xs text-on-surface bg-surface-container/60 hover:bg-surface-container rounded-2xl border border-outline/60 transition-all cursor-pointer leading-relaxed"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="air-ai-chat-thread">
              {chatStore.messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`air-ai-message ${isUser ? 'air-ai-message-user' : 'air-ai-message-agent'}`}
                  >
                    <div className="air-ai-message-bubble flex flex-col gap-1">
                      {m.content || (
                        <div className="air-ai-typing-indicator">
                          <span className="dot" />
                          <span className="dot" />
                          <span className="dot" />
                        </div>
                      )}
                      <span className="text-[9px] text-on-surface-variant font-mono mt-1">
                        {isUser ? 'You' : 'Workers AI'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  });

  // Isolate bottom chat input
  const DrawerFooterSnippet = snippet(() => (
    <div className="p-4 border-t border-outline bg-surface-container/40 shrink-0 flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Model</span>
        <SelectField
          value={$bind(() => chatStore, 'model')}
          className="bg-surface-container border border-outline rounded-lg px-2.5 py-0.5 text-[11px] text-white focus:outline-none focus:border-[#F38020] cursor-pointer"
        >
          {chatModels.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </SelectField>
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <InputField
          value={$bind(() => chatStore, 'input')}
          placeholder="Ask Workers AI assistant..."
          disabled={!state.activeConversationId || chatStore.sending}
          className="flex-1 px-4 py-2.5 bg-surface-container-lowest border border-outline rounded-xl text-xs text-white placeholder-on-surface-variant focus:outline-none focus:border-[#F38020] transition-colors"
        />
        <button
          type="submit"
          disabled={!state.activeConversationId || !chatStore.input.trim() || chatStore.sending}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            !state.activeConversationId || !chatStore.input.trim() || chatStore.sending
              ? 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
              : 'bg-[#F38020] text-white hover:opacity-95 shadow-md shadow-[#F38020]/20'
          }`}
        >
          <span className={`air-icon text-base ${chatStore.sending ? 'animate-spin' : ''}`}>
            {chatStore.sending ? 'refresh' : 'send'}
          </span>
        </button>
      </form>
    </div>
  ));

  // Outer drawer container mounts/unmounts reactively when drawer open state toggles
  return render(() => {
    if (!state.chatDrawerOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        <div
          onClick={state.closeChat}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in transition-opacity"
        />
        <div className="relative w-full max-w-md h-full glass-panel flex flex-col shadow-2xl border-l border-outline animate-slide-up bg-[#0e1017]">
          <DrawerHeaderSnippet />
          <DrawerBodySnippet />
          <DrawerFooterSnippet />
        </div>
      </div>
    );
  });
});
