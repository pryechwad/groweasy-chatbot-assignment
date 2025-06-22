import React from 'react';
import Avatar from '../ui/Avatar';
import type { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${isSystem ? 'justify-center' : ''}`}>
      <div className={`flex items-end gap-1 sm:gap-2 lg:gap-3 max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}>
        <Avatar type={message.sender} />
        <div className="flex flex-col">
          <div
            className={`px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-3 rounded-xl sm:rounded-2xl break-words shadow-lg ${
              isUser
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md transform hover:scale-105 transition-transform'
                : isSystem
                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-gray-900 dark:text-white border border-yellow-200 dark:border-yellow-500/30 rounded-md backdrop-blur-sm'
                  : 'bg-gradient-to-r from-white to-blue-50 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white border border-purple-200 dark:border-purple-500/30 rounded-bl-md backdrop-blur-sm'
            }`}
          >
            <p className="text-xs sm:text-sm lg:text-base leading-relaxed">{message.text}</p>
          </div>
          <span className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
