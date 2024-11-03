import { ArrowRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

const TypeWriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return;
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
        <span className="text-white">
          <span className="animate-pulse">Loading...</span>
        </span>
      ) : (
        <div
          className={`max-w-[80%] p-4 rounded-2xl ${isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-800 text-blue-100 rounded-bl-none'
            }`}
        >
          <p className={`font-inter whitespace-pre-wrap ${message.startsWith('provider') || message.startsWith('#') ? 'font-mono' : ''}`}>
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

const ChatInterface = ({userId, showInput, inputValue, setInputValue, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  // const [userId] = useState(() => 'user-' + Math.random().toString(36).substr(2, 9));
  const initializationRef = useRef(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isComplete && onComplete) {
      setTimeout(() => {
        onComplete(userId);  // Pass the userId here
      }, 1000);
    }
  }, [isComplete, onComplete, userId]);

  const generateTerraformCode = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_terraform_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          text: "Here's the generated Terraform code for your deployment:",
          isUser: false
        },
        {
          text: data.terraform_code,
          isUser: false
        }
      ]);
    } catch (error) {
      console.error('Error generating Terraform code:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error generating the Terraform code. Please try again.",
        isUser: false
      }]);
    }
  };

  const initializeConversation = async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    try {
      const response = await fetch('http://127.0.0.1:5000/initialize_use_case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          use_case: "Please ask a question to the user to add any more specifications to help you creating a Terraform deployment code down the line."
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response === "RESPONSE COMPLETE") {
        setIsComplete(true);
        setMessages(prev => [...prev, {
          text: "Great! All the necessary information has been collected. We can now proceed with the deployment.",
          isUser: false
        }]);
        // Generate Terraform code after completion
        await generateTerraformCode();
        return;
      }

      setMessages(prev => [...prev, { text: data.question, isUser: false }]);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error connecting to the server. Please try again.",
        isUser: false
      }]);
    }
  };

  const sendAnswer = async (answer) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/initialize_use_case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          answer: answer
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response === "RESPONSE COMPLETE") {
        
        setMessages(prev => [...prev, {
          text: "Great! All the necessary information has been collected. We can now proceed with the deployment.",
          isUser: false
        }]);
        setTimeout(() => {
          setIsComplete(true);
  
        }, 3000);
        
        // Generate Terraform code after completion
        return;
      }

      setMessages(prev => [...prev, { text: data.question, isUser: false }]);
    } catch (error) {
      console.error('Error sending answer:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error connecting to the server. Please try again.",
        isUser: false
      }]);
    }
  };

  useEffect(() => {
    initializeConversation();
    return () => {
      initializationRef.current = false;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (!inputValue.trim() || isComplete) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputValue('');
    sendAnswer(userMessage);
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
              placeholder={isComplete ? "Configuration complete" : "Type your message..."}
              className="font-montserrat w-full px-6 py-4 bg-slate-900 text-blue-200 rounded-full 
                        border-2 border-blue-500 focus:outline-none focus:border-blue-900
                        placeholder-blue-200 pr-16 resize-none overflow-hidden"
              rows="1"
              style={{ minHeight: '56px' }}
              disabled={isComplete}
            />
            <button
              onClick={handleSubmit}
              disabled={isComplete}
              className={`absolute right-4 p-2 text-white rounded-full transition-colors duration-200
                        ${isComplete
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
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