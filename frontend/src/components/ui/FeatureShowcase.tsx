import React from 'react';

const FeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Qualification',
      description: 'Advanced GPT integration for intelligent lead scoring'
    },
    {
      icon: '📊',
      title: 'Real-time Classification',
      description: 'Instant Hot/Cold/Invalid lead categorization'
    },
    {
      icon: '💾',
      title: 'MongoDB Storage',
      description: 'Persistent chat history and lead analytics'
    },
    {
      icon: '🎯',
      title: 'Industry Agnostic',
      description: 'Configurable for any business vertical'
    }
  ];

  return (
    <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 mx-2 sm:mx-4 lg:mx-6 mb-3 sm:mb-4">
      <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base text-center">
        🚀 System Features
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="text-base sm:text-lg lg:text-xl mb-1 sm:mb-2">{feature.icon}</div>
            <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {feature.title}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">
              {feature.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureShowcase;