"use client";
import React, { useEffect, useRef, useState } from 'react';

import RetroButton from '@/app/components/RetroButton';

import arcade from './../../public/images/arcade.png';
import ChatInterface from './components/ChatInterface';
import DeploymentQuestions from './components/DeploymentQuestions';
import LoadingProgress from './components/SequentialLoading';
import StarryBackground from './components/StarryBackground';
import TerraformDeployment from './components/TerraformDeployment';

const AnimatedGameScreen = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showText, setShowText] = useState(false);
  const [text, setText] = useState('');
  const [textComplete, setTextComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showSubText, setShowSubText] = useState(false);
  const [isTextFading, setIsTextFading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [initialQuestion, setInitialQuestion] = useState(false);
  const fileInputRef = useRef(null);
  const [removeArcade, setRemoveArcade] = useState(false);
  const [deploymentConfig, setDeploymentConfig] = useState(null);
  const [isChatComplete, setIsChatComplete] = useState(false);
  const [showLoadingProgress, setShowLoadingProgress] = useState(false);
  const [showTerraformCode, setShowTerraformCode] = useState(false);
  const [terraformMessages, setTerraformMessages] = useState([]);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [userId, setUserId] = useState(() => 'user-' + Math.random().toString(36).substr(2, 9));


  const fullText = "NimbusOps";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setRemoveArcade(true);
      }, 1000)
      setTimeout(() => {
        setShowText(true);
      }, 1800);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showText) {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTextComplete(true);
          setTimeout(() => {
            setShowButton(true);
            setShowSubText(true);
          }, 500);
        }
      }, 150);
      return () => clearInterval(typingInterval);
    }
  }, [showText]);

  const generateTerraformCode = async () => {
    setIsGeneratingCode(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_terraform_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId  // Use the stored userId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setTerraformMessages([
        {
          text: "Here's the generated Terraform code for your deployment:",
          isUser: false
        },
        {
          text: data.terraform_code,
          isUser: false,
          isCode: true
        }
      ]);
    } catch (error) {
      console.error('Error generating Terraform code:', error);
      setTerraformMessages([{
        text: "Sorry, there was an error generating the Terraform code. Please try again.",
        isUser: false
      }]);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleFolderSelect = (event) => {
    const folder = event.target.files;
  };

  const handleArrowClick = () => {
    setTimeout(() => {
      setIsTextFading(true);
      setShowText(false);
      setShowSubText(false);
      setTimeout(() => {
        setInitialQuestion(true);
      }, 750);
    }, 100);
  };

  const handleChatComplete = (userId) => {  // Accept userId parameter
    setIsChatComplete(true);
    setShowLoadingProgress(true);
    // Store userId for later use
    setUserId(userId);  // Add this state if you haven't already
  };

  const handleLoadingComplete = () => {
    setShowLoadingProgress(false);
    setShowTerraformCode(true);
    generateTerraformCode();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black to-blue-950 overflow-hidden">
      <div
        className={`w-full h-full flex items-center justify-center transition-transform duration-[2000ms] ease-in-out ${isAnimating ? 'scale-[5] translate-y-[10%]' : 'scale-100'}`}
      >
        <div className="relative w-[70%] max-w-xl">
          <img
            src={arcade.src}
            alt="Arcade Machine"
            className={`w-full h-auto scale-200 transition-opacity duration-1000 ${removeArcade ? 'opacity-0' : 'opacity-100'}`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b from-black to-purple transition-opacity duration-[3000ms] ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>
      <StarryBackground />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <h3
          className={`
            text-4xl font-pressStart text-white 
            transition-all duration-1000 ease-in-out mb-0
            ${showText ? 'opacity-100' : 'opacity-0'}
            ${textComplete ? '-translate-y-8' : 'translate-y-0'}
            ${isTextFading ? 'opacity-0 -translate-y-48 pointer-events-none' : ''}
          `}
        >
          {text}
          <span className="animate-pulse">|</span>
        </h3>

        <p
          className={`
            text-lg text-gray-300 max-w-2xl text-center font-inter 
            transition-all duration-1000 ease-in-out
            ${showSubText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            ${isTextFading ? 'opacity-0 -translate-y-48 pointer-events-none' : ''}
          `}
        >
          Transform your DevOps workflow with interactive, chat-based cloud deployments.
        </p>

        <div
          className={`
            transition-all duration-500 transform 
            ${(showButton && !isChatComplete) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <RetroButton
            onClick={triggerFileInput}
            fileInputRef={fileInputRef}
            handleFolderSelect={handleFolderSelect}
            onArrowClick={handleArrowClick}
          />
        </div>
      </div>

      <div
        className={`
          absolute top-1/3 left-0 w-full
          transition-all duration-500 ease-in-out
          ${initialQuestion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <DeploymentQuestions
          onComplete={(answers) => {
            setDeploymentConfig(answers);
            setShowInput(true);
          }}
        />
      </div>

      {showInput && !showLoadingProgress && !showTerraformCode && (
        <ChatInterface
          userId={userId}  // Add this prop
          showInput={showInput}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onComplete={handleChatComplete}
        />
      )}

      {showLoadingProgress && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <LoadingProgress onComplete={handleLoadingComplete} />
        </div>
      )}

      {showTerraformCode && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {isGeneratingCode ? (
            <div className="text-white font-pressStart animate-pulse">
              Generating Terraform Code...
            </div>
          ) : (
            <TerraformDeployment
              terraformCode={terraformMessages[1]?.text}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AnimatedGameScreen;