'use client';

import { ModeSelector } from '@/components/mode-selector';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';
import { Sidebar } from '@/components/chat/sidebar';

export function ChatInterface() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ModeSelector />
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}
