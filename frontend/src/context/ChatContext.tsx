import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Message, ChatState } from '../types/chat';

interface ChatContextType extends ChatState {
  sendMessage: (text: string) => void;
  clearChat: () => void;
  chatEnded: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'chatbot-messages';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [sessionId] = useState(() => 'session_' + Date.now());

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedMessages = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.data.reply,
        sender: 'bot',
        timestamp: new Date(data.data.timestamp)
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Check if this is a site visit confirmation
      if (data.data.isSiteVisitConfirmation) {
        // Add a delay before showing the chat ended message
        setTimeout(() => {
          const endMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "Thank you for providing your details. Our representative will contact you soon. This chat session has ended.",
            sender: 'system',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, endMessage]);
          setChatEnded(true);
        }, 2000);
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setError(null);
    setChatEnded(false);
  };

  return (
    <ChatContext.Provider value={{ messages, isTyping, error, sendMessage, clearChat, chatEnded }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};