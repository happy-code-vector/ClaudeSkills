'use client';

import { useChatStore } from '@/lib/store';
import { MessageItem } from './message-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';

export function MessageList() {
  const { currentChat, isLoading } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  if (!currentChat) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Start a new chat to begin</p>
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollRef} className="flex-1 h-full">
      <div className="flex flex-col">
        {currentChat.messages?.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              {currentChat.messages?.length === 0
                ? 'Send a message to start chatting'
                : 'No messages yet'}
            </p>
          </div>
        ) : (
          currentChat.messages?.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 p-4 bg-muted/50">
            <div className="h-8 w-8 shrink-0 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
