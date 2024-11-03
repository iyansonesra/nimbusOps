import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const MOCK_API_RESPONSE = {
  message: "I've analyzed your deployment configuration. I can help you set up a Kubernetes cluster with the following specifications:\n\n1. Region: us-west-2\n2. Node count: 3\n3. Instance type: t3.medium\n\nWould you like me to proceed with this configuration?"
};

const TypeWriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 18);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span>{displayedText}</span>;
};

const ChatMessage = ({ message, isUser }) => {
  const [isLoading, setIsLoading] = useState(!isUser);
  const [isTyping, setIsTyping] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(isUser);

  useEffect(() => {
    if (!isUser) {
      // Show loading state for 2 seconds
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        setIsTyping(true);
      }, 2000);

      return () => clearTimeout(loadingTimer);
    }
  }, [isUser]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 font-montserrat`}>
    {isLoading ? (
            <span className = "text-white">
             
              <span className="animate-pulse">Loading...</span>
            </span>
          ) : (
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-800 text-blue-100 rounded-bl-none'
        }`}
      >
        <p className="font-inter whitespace-pre-wrap">
          {showFullMessage ? (
            message
          ) : (
            <TypeWriter 
              text={message} 
              onComplete={() => {
                setIsTyping(false);
                setShowFullMessage(true);
              }}
            />
          )}
          {isTyping && <span className="animate-pulse">▋</span>}
        </p>
      </div>
          )}
    </div>
  );
};

const ChatInterface = ({ showInput, inputValue, setInputValue }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initial message with loading and typing animation
    setMessages([{ text: MOCK_API_RESPONSE.message, isUser: false }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    setInputValue('');

    // Add AI response with loading and typing animation
    setMessages(prev => [...prev, {
      text: "I understand. I'll proceed with the deployment based on your input. Is there anything specific you'd like me to modify?",
      isUser: false
    }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <ScrollArea className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="max-w-3xl mx-auto h-full pt-12">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div
        className={`
          fixed bottom-0 left-0 w-full 
          transition-transform duration-500 ease-in-out
          ${showInput ? 'translate-y-0' : 'translate-y-full'}
          bg-gradient-to-t from-black to-transparent pt-6
        `}
      >
        <div className="max-w-3xl mx-auto p-6">
          <div className="relative flex items-center">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="font-montserrat w-full px-6 py-4 bg-slate-900 text-blue-200 rounded-full 
                        border-2 border-blue-500 focus:outline-none focus:border-blue-900
                        placeholder-blue-200 pr-16 resize-none overflow-hidden"
              rows="1"
              style={{ minHeight: '56px' }}
            />
            <button
              onClick={handleSubmit}
              className="absolute right-4 p-2 text-white bg-blue-600 rounded-full 
                       hover:bg-blue-700 transition-colors duration-200"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;