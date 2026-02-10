'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { useChatStore } from '@/lib/store';
import { useEffect } from 'react';

export default function Home() {
  const createNewChat = useChatStore((state) => state.createNewChat);

  useEffect(() => {
    // Create a new chat on initial load
    createNewChat();
  }, [createNewChat]);

  return <ChatInterface />;
}
