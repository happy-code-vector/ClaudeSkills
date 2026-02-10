'use client';

import { ChatMode } from '@/types/chat';
import { useChatStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search } from 'lucide-react';

const modes: { value: ChatMode; label: string; icon: React.ReactNode }[] = [
  { value: 'normal', label: 'Normal Chat', icon: <MessageSquare className="h-4 w-4" /> },
  { value: 'last30days', label: 'last30days Skill', icon: <Search className="h-4 w-4" /> },
];

export function ModeSelector() {
  const { currentMode, setCurrentMode } = useChatStore();

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      {modes.map((mode) => (
        <Button
          key={mode.value}
          variant={currentMode === mode.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setCurrentMode(mode.value)}
          className="flex items-center gap-2"
        >
          {mode.icon}
          {mode.label}
        </Button>
      ))}
    </div>
  );
}
