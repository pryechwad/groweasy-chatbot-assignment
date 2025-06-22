import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Home />
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;
