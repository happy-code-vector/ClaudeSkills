import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { executeLast30DaysSkill } from '@/lib/skills';
import { ChatMode } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const supabaseServer = getSupabaseServer();
    const body = await request.json();
    const { chatId, mode, content } = body;

    if (!content || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create chat
    let chat;
    if (chatId) {
      const { data: existingChat, error } = await supabaseServer
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single();

      if (error) throw error;
      chat = existingChat;
    } else {
      // Create new chat
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      const { data: newChat, error } = await supabaseServer
        .from('chats')
        .insert({
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      chat = newChat;
    }

    // Save user message
    const userMessage = {
      id: crypto.randomUUID(),
      chat_id: chat.id,
      role: 'user',
      content,
      mode,
      created_at: new Date().toISOString(),
    };

    await supabaseServer.from('messages').insert(userMessage);

    // Generate response based on mode
    let response = '';

    if (mode === 'last30days') {
      const result = await executeLast30DaysSkill(content);
      if (result.success) {
        response = result.output;
      } else {
        response = `Error executing skill: ${result.error}\n\nPlease make sure the last30days skill is installed. Run: claude skill install last30days`;
      }
    } else {
      // Normal chat - you can integrate with Claude API here
      response = 'This is a normal chat. Configure your Claude API integration in app/api/chat/route.ts';
    }

    // Save assistant message
    const assistantMessage = {
      id: crypto.randomUUID(),
      chat_id: chat.id,
      role: 'assistant',
      content: response,
      mode,
      created_at: new Date().toISOString(),
    };

    await supabaseServer.from('messages').insert(assistantMessage);

    // Update chat timestamp
    await supabaseServer
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chat.id);

    return NextResponse.json({
      message: assistantMessage,
      chat,
      response,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
