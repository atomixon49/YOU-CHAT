import SupabaseService from './SupabaseService';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  created_at: string;
}

export interface Chat {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
  last_message?: Message;
  participants?: { user_id: string }[];
}

class ChatService {
  private static instance: ChatService;
  private supabase = SupabaseService.getClient();
  private chatSubscriptions: Map<string, RealtimeChannel> = new Map();
  private messageCallbacks: ((message: Message) => void)[] = [];

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async initialize(): Promise<void> {
    // La inicialización se maneja cuando se conecta a un chat específico
  }

  async getChats(userId: string): Promise<Chat[]> {
    try {
      const { data: chats, error } = await this.supabase
        .from('chats')
        .select(`
          *,
          participants:chat_participants(user_id),
          last_message:messages(
            id,
            content,
            sender_id,
            created_at
          )
        `)
        .eq('chat_participants.user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return chats || [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  async createChat(participantIds: string[], name?: string): Promise<Chat> {
    try {
      const { data: chat, error: chatError } = await this.supabase
        .from('chats')
        .insert([{
          name: name,
          is_group: participantIds.length > 2
        }])
        .select()
        .single();

      if (chatError) throw chatError;

      const participants = participantIds.map(userId => ({
        chat_id: chat.id,
        user_id: userId
      }));

      const { error: participantsError } = await this.supabase
        .from('chat_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      return chat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  async getMessages(chatId: string): Promise<Message[]> {
    try {
      const { data: messages, error } = await this.supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(chatId: string, content: string, senderId: string): Promise<Message> {
    try {
      const { data: message, error } = await this.supabase
        .from('messages')
        .insert([{
          chat_id: chatId,
          content: content,
          sender_id: senderId
        }])
        .select()
        .single();

      if (error) throw error;
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  subscribeToChat(chatId: string): void {
    if (this.chatSubscriptions.has(chatId)) {
      return;
    }

    const channel = this.supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const message = payload.new as Message;
          this.messageCallbacks.forEach(callback => callback(message));
        }
      )
      .subscribe();

    this.chatSubscriptions.set(chatId, channel);
  }

  unsubscribeFromChat(chatId: string): void {
    const channel = this.chatSubscriptions.get(chatId);
    if (channel) {
      channel.unsubscribe();
      this.chatSubscriptions.delete(chatId);
    }
  }

  onMessage(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  removeMessageListener(callback: (message: Message) => void): void {
    const index = this.messageCallbacks.indexOf(callback);
    if (index > -1) {
      this.messageCallbacks.splice(index, 1);
    }
  }

  async getChatParticipants(chatId: string): Promise<string[]> {
    try {
      const { data: participants, error } = await this.supabase
        .from('chat_participants')
        .select('user_id')
        .eq('chat_id', chatId);

      if (error) throw error;
      return participants.map(p => p.user_id);
    } catch (error) {
      console.error('Error fetching chat participants:', error);
      throw error;
    }
  }
}

export default ChatService.getInstance();