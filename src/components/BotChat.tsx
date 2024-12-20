'use client';

import axios from 'axios'; // For API communication
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '@/libs/firebase'; // Make sure to import the correct methods

const BotChat = () => {
  const [isOpen, setIsOpen] = useState(false); // Toggle chat visibility
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    {
      sender: 'bot',
      text: '¡Hola! Soy 🤖 Freeland AI®. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication status

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user is logged in, set isAuthenticated to true
        setIsAuthenticated(true);
      } else {
        // If the user is not logged in, set isAuthenticated to false
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput(''); // Clear input field

    try {
      if (!isAuthenticated) {
        // If not logged in, respond with a message saying the user needs to log in
        const botMessage = {
          sender: 'bot',
          text: 'Debes iniciar sesión para conectarte a 🤖 Freeland AI®',
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      // If the user is logged in, make the API call to ChatGPT
      const response = await axios.post('/api/chatbot', { prompt: input }); // Send to the API route

      const botMessage = { sender: 'bot', text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]); // Add bot's reply
    } catch (error) {
      console.error('Error communicating with bot:', error);
      const errorMessage = {
        sender: 'bot',
        text: 'Hubo un error. Por favor, intenta de nuevo.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <button
        type="button"
        className="fixed bottom-6 right-6 rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-500"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        🤖 Freeland AI®
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 flex w-80 flex-col overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Chat Header */}
          <div className="bg-blue-600 p-4 text-lg font-semibold text-white">
            🤖 Freeland AI®
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={Math.random()}
                className={`flex ${
                  msg.sender === 'bot' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    msg.sender === 'bot'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center space-x-2 border-t border-gray-200 p-3">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 p-2"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
              onClick={handleSendMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotChat;
