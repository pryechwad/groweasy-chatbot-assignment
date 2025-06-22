import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';

const suggestedPrompts = [
  "I'm interested in buying a property",
  "Looking for 2BHK in Pune",
  "Location: Mumbai, budget: 50L",
  "Need property within 3 months"
];

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isTyping, error, chatEnded } = useChat();

  const handleSend = () => {
    if (input.trim() && !isTyping && !chatEnded) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    if (!isTyping && !chatEnded) {
      // Set the input field to show what was selected
      setInput(prompt);
      // Then send the message after a brief delay to make it visible
      setTimeout(() => {
        sendMessage(prompt);
        setInput('');
      }, 300);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 dark:from-gray-800 dark:via-purple-900/30 dark:to-blue-900/30">
      {error && (
        <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {/* Suggested Prompts - Only show when no messages */}
      <div className="px-2 sm:px-3 lg:px-4 pt-2 sm:pt-3 pb-1 sm:pb-2">
        <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-3 justify-center">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedPrompt(prompt)}
              disabled={isTyping || chatEnded}
              className="px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-4">
        <input
          type="text"
          placeholder={isTyping ? "Bot is typing..." : chatEnded ? "Chat session has ended" : "Type your message... 💬"}
          className="flex-1 p-2 sm:p-3 lg:p-4 border-2 border-purple-200 dark:border-purple-500/30 rounded-lg sm:rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-purple-400 dark:placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base lg:text-lg transition-all duration-300 disabled:opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping || chatEnded}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping || chatEnded}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl transition-all duration-300 font-medium text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
        >
          {isTyping ? '⏳' : chatEnded ? '🔒' : '🚀'}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
