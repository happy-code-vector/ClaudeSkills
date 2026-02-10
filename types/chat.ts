export type MessageRole = 'user' | 'assistant' | 'system';

export type ChatMode = 'normal' | 'last30days';

export interface Message {
  id: string;
  chat_id: string;
  role: MessageRole;
  content: string;
  mode?: ChatMode;
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface CreateMessageRequest {
  chatId?: string;
  mode: ChatMode;
  content: string;
}

export interface CreateMessageResponse {
  message: Message;
  chat: Chat;
  response: string;
}
