'use client';

import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/chat', {
        message: input,
      });

      const botMessage = { role: 'bot', content: response.data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'bot',
        content: 'Error: Could not connect to the server.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
        title="Open Travel Chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="mt-2 w-[400px] bg-white shadow-2xl rounded-2xl  flex flex-col h-[28rem] border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#24436eaa] to-[#81ffec] text-white p-3 rounded-t-lg">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                alt="Anchal Bot"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h2 className="text-base font-bold">Anchal</h2>
                <p className="text-xs">Your Travel Assistant</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-b-lg">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                } items-start`}
              >
                {msg.role !== 'user' && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                    alt="Bot"
                    className="w-6 h-6 rounded-full mr-2 mt-1"
                  />
                )}
                <div
                  className={`max-w-[70%] p-2 text-sm rounded-lg shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="mt-2 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              placeholder="Ask Anchal about travel..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`bg-blue-600 text-white px-4 py-2 text-sm rounded-r-lg hover:bg-blue-700 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;