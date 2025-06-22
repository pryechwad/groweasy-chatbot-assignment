import React, { useState } from 'react';

const SimpleChat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot'}>>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      const userMsg = { id: Date.now().toString(), text: input, sender: 'user' as const };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      
      setTimeout(() => {
        const botMsg = { id: (Date.now() + 1).toString(), text: `You said: ${input}`, sender: 'bot' as const };
        setMessages(prev => [...prev, botMsg]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-blue-500 text-white font-bold rounded-t-lg">
        Simple Chat
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default SimpleChat;