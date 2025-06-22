export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  chatEnded: boolean;
}