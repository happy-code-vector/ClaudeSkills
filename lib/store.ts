import { create } from 'zustand';
import { Chat, Message, ChatMode } from '@/types/chat';

interface ChatStore {
  chats: Chat[];
  currentChat: Chat | null;
  currentMode: ChatMode;
  isLoading: boolean;
  setChats: (chats: Chat[]) => void;
  setCurrentChat: (chat: Chat | null) => void;
  setCurrentMode: (mode: ChatMode) => void;
  setIsLoading: (isLoading: boolean) => void;
  addMessageToCurrentChat: (message: Message) => void;
  createNewChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  currentChat: null,
  currentMode: 'normal',
  isLoading: false,
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setCurrentMode: (mode) => set({ currentMode: mode }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addMessageToCurrentChat: (message) =>
    set((state) => ({
      currentChat: state.currentChat
        ? {
            ...state.currentChat,
            messages: [...(state.currentChat.messages || []), message],
          }
        : null,
    })),
  createNewChat: () =>
    set((state) => {
      const newChat: Chat = {
        id: crypto.randomUUID(),
        title: 'New Chat',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
      };
      return {
        currentChat: newChat,
        chats: [newChat, ...state.chats],
      };
    }),
}));
