import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-primary dark:bg-gradient-dark transition-all duration-500">
      {/* Responsive layout: Mobile full screen, Tablet/Desktop centered */}
      <div className="h-screen flex items-center justify-center p-0 sm:p-2 md:p-4 lg:p-6">
        <div className="w-full h-full sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[750px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] sm:shadow-2xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default Home;
