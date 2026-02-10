'use client';

import { useState, KeyboardEvent } from 'react';
import { useChatStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export function MessageInput() {
  const [input, setInput] = useState('');
  const { currentChat, currentMode, isLoading, addMessageToCurrentChat, createNewChat } =
    useChatStore();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input.trim();
    setInput('');

    // Create new chat if none exists
    if (!currentChat) {
      createNewChat();
    }

    const userMessage = {
      id: crypto.randomUUID(),
      chat_id: currentChat?.id || crypto.randomUUID(),
      role: 'user' as const,
      content: messageContent,
      mode: currentMode,
      created_at: new Date().toISOString(),
    };

    addMessageToCurrentChat(userMessage);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentChat?.id,
          mode: currentMode,
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const assistantMessage = {
        id: crypto.randomUUID(),
        chat_id: data.chat.id,
        role: 'assistant' as const,
        content: data.response,
        mode: currentMode,
        created_at: new Date().toISOString(),
      };

      addMessageToCurrentChat(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="flex-1 min-h-[60px] max-h-[200px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
