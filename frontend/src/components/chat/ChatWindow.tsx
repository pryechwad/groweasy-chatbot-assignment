import React, { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from '../ui/TypingIndicator';
import FeatureShowcase from '../ui/FeatureShowcase';
import { useChat } from '../../context/ChatContext';

const ChatWindow: React.FC = () => {
  const { messages, isTyping } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 sm:rounded-2xl overflow-hidden shadow-2xl">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20">
        {messages.length === 0 ? (
          <div className="text-center mt-2 sm:mt-4 lg:mt-6 space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4">🏠</div>
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400 px-4">
                AI Lead Qualification Assistant
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-sm lg:max-w-md mx-auto px-4">
                Intelligent real estate lead qualification powered by AI. Get classified as Hot, Cold, or Invalid based on your responses.
              </p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 mx-2 sm:mx-4 lg:mx-6 backdrop-blur-sm">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">
                🎯 What We Qualify:
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-green-500">📍</span> Location
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-blue-500">🏢</span> Property Type
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-yellow-500">💰</span> Budget Range
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-red-500">⏰</span> Timeline
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 mx-2 sm:mx-4 lg:mx-6">
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                💡 <strong>Try the suggested prompts below</strong> to see how our AI qualifies different types of leads!
              </p>
            </div>
            
            <FeatureShowcase />
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
