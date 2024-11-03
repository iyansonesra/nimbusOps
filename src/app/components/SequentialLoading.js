import { useState, useEffect } from 'react';

const LoadingProgress = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const steps = [
    { text: "Analyzing folder structure...", duration: 5000 },
    { text: "Configuring for cloud platform...", duration: 4500 },
    { text: "Optimizing options...", duration: 4000 }
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const generatePause = () => {
        if (Math.random() < 0.3) {
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), Math.random() * 800 + 200);
        }
      };

      const progressInterval = setInterval(() => {
        if (!isPaused) {
          setProgress(prev => {
            const increment = Math.random() * 3 + 40;
            const newProgress = Math.min(prev + increment, 100);

            // Immediately move to next step when reaching 100%
            if (newProgress >= 100 && currentStep < steps.length - 1) {
              setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setProgress(0);
              }, 50); // Tiny delay for smooth transition
            } else if (newProgress >= 100) {
              onComplete?.();
            }

            generatePause();
            return newProgress;
          });
        }
      }, 100);

      return () => {
        clearInterval(progressInterval);
      };
    }
  }, [currentStep, isPaused]);

  const loadingMessages = [
    "Processing dependencies...",
    "Validating configuration...",
    "Checking resources...",
    "Preparing deployment...",
    "Scanning components...",
    "Analyzing architecture...",
  ];
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    if (isPaused) {
      setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    } else {
      setLoadingMessage("");
    }
  }, [isPaused]);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/50 p-6 rounded-lg backdrop-blur-sm">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`mb-4 transition-all duration-300 ${index === currentStep
              ? 'opacity-100 transform translate-y-0'
              : index < currentStep
                ? 'opacity-50 transform -translate-y-2'
                : 'opacity-30 transform translate-y-2'
            }`}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-blue-200 font-medium">
                {step.text}
              </span>
              {/* {index === currentStep && isPaused && (
                <span className="text-xs ml-2 text-blue-400 animate-fade-in">
                  {loadingMessage}
                </span>
              )} */}
            </div>
            <span className="text-blue-300 text-sm min-w-[40px] text-right">
              {index === currentStep ? `${Math.min(Math.round(progress), 100)}%` : index < currentStep ? '100%' : '0%'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${isPaused && index === currentStep
                  ? 'bg-blue-400'
                  : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                }`}
              style={{
                width: `${index === currentStep ? progress : index < currentStep ? 100 : 0}%`,
              }}
            />
          </div>
        </div>
      ))}

      \
    </div>
  );
};

export default LoadingProgress;