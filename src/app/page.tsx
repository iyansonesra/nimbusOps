"use client";
import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import game from './../../public/images/machine.png';
import arcade from './../../public/images/arcade.png';
import RetroButton from '@/app/components/RetroButton';
import StarryBackground from './components/StarryBackground';
import DeploymentQuestions from './components/DeploymentQuestions';
import LoadingProgress from './components/SequentialLoading';
import ChatInterface from './components/ChatInterface';

import { set } from 'zod';

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
  const [isLoading, setIsLoading] = useState(true);



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

  const handleFolderSelect = (event) => {
    const folder = event.target.files;
    console.log('Selected folder:', folder);
  };

  const handleArrowClick = () => {
    setTimeout(() => {
      setIsTextFading(true);
      setShowText(false);
      setShowSubText(false);
      setTimeout(() => {
        setInitialQuestion(true);
      }, 750);
      console.log('Text fading');
    }, 100);
  };

  const handleInputSubmit = () => {
    console.log('Input submitted:', inputValue);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black to-blue-950 overflow-hidden">
      <div
        className={`w-full h-full flex items-center justify-center transition-transform duration-[2000ms] ease-in-out ${isAnimating ? 'scale-[5] translate-y-[10%]' : 'scale-100'
          }`}
      >
        <div className="relative w-[70%] max-w-xl">
          <img
            src={arcade.src}
            alt="Arcade Machine"
            className={`w-full h-auto scale-200 transition-opacity duration-1000 ${removeArcade ? 'opacity-0' : 'opacity-100'
              }`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b from-black to-purple transition-opacity duration-[3000ms] ${isAnimating ? 'opacity-100' : 'opacity-0'
              }`}
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
            ${(showButton && isLoading) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
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
            console.log('Deployment configuration received:', answers);
          }}
        />

      </div>
      {showInput && (
        <>
          {isLoading ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
              <LoadingProgress 
                onComplete={() => {
                  setIsLoading(false);
                }} 
              />
            </div>
          ) : (
            <ChatInterface 
              showInput={showInput}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          )}
        </>
      )}


    </div>
  );
};

export default AnimatedGameScreen;