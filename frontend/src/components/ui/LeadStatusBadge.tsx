import React from 'react';

interface LeadStatusBadgeProps {
  status: 'Hot' | 'Cold' | 'Invalid' | 'Qualifying';
  confidence?: number;
}

const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status, confidence }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Hot':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-orange-500',
          text: 'text-white',
          icon: '🔥',
          label: 'Hot Lead'
        };
      case 'Cold':
        return {
          bg: 'bg-gradient-to-r from-blue-400 to-cyan-400',
          text: 'text-white',
          icon: '❄️',
          label: 'Cold Lead'
        };
      case 'Invalid':
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
          text: 'text-white',
          icon: '❌',
          label: 'Invalid'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-amber-400',
          text: 'text-white',
          icon: '⏳',
          label: 'Qualifying'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} shadow-lg`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
      {confidence && (
        <span className="ml-1 opacity-80">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </div>
  );
};

export default LeadStatusBadge;