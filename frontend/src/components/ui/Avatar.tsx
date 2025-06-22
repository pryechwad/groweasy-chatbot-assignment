import React from 'react';

interface AvatarProps {
  type: 'user' | 'bot' | 'system';
  size?: 'sm' | 'md';
}

const Avatar: React.FC<AvatarProps> = ({ type, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold ${
      type === 'user' 
        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
        : type === 'system'
          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
    }`}>
      {type === 'user' ? '👤' : type === 'system' ? '🔔' : '🤖'}
    </div>
  );
};

export default Avatar;