import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../context/ChatContext';

const ChatHeader: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { clearChat, messages } = useChat();

  return (
    <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
      <div>
        <h1 className="font-bold text-sm sm:text-base lg:text-lg xl:text-xl text-white drop-shadow-lg">
          🏠 GrowEasy AI Qualifier
        </h1>
        <p className="text-xs sm:text-sm text-white/80 hidden sm:block lg:text-sm">
          Real Estate Lead Qualification System
        </p>
      </div>
      <div className="flex items-center gap-2">
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 text-sm hover:scale-110"
            aria-label="Clear chat"
          >
            🗑️
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 text-lg hover:scale-110"
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
