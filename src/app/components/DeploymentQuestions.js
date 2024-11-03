import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DeploymentQuestions = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState('deployment');
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({
    deploymentPlatform: '',
    credentials: {
      username: '',
      password: '',
      projectNumber: '',
      region: ''
    }
  });

  const deploymentOptions = [
    { id: 'aws', label: 'AWS' },
    { id: 'google-cloud', label: 'Google Cloud', value: 'gcp' },
    { id: 'azure', label: 'Azure' },
    { id: 'docker', label: 'Docker' }
  ];

  const regions = [
    { id: 'us-east', label: 'US East' },
    { id: 'us-west', label: 'US West' },
    { id: 'eu-west', label: 'EU West' },
    { id: 'eu-central', label: 'EU Central' },
    { id: 'ap-southeast', label: 'Asia Pacific Southeast' }
  ];

  const sendCloudProvider = async (provider, userId = '123') => {
    try {
      const response = await fetch('http://127.0.0.1:5000/set_cloud_provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          cloud_provider: provider === 'google-cloud' ? 'gcp' : provider
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
      return data;
    } catch (error) {
      console.error('Error sending cloud provider to server:', error);
      setError('Failed to send cloud provider to server');
      throw error;
    }
  };

  const handleDeploymentSelect = async (platform) => {
    setAnswers(prev => ({ ...prev, deploymentPlatform: platform }));
    
    try {
      await sendCloudProvider(platform);
      // Only transition to credentials screen if API call is successful
      handleTransition('credentials');
    } catch (error) {
      // Error is already set by sendCloudProvider
      // You might want to show an error message to the user here
      console.error('Failed to set cloud provider:', error);
    }
  };

  const handleTransition = (nextQuestion) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuestion(nextQuestion);
      setIsAnimating(false);
    }, 500);
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    const finalAnswers = {
      ...answers,
      timestamp: new Date().toISOString()
    };
    setIsAnimating(true);
    setTimeout(() => {
      onComplete?.(finalAnswers);
    }, 500);
  };

  const handleCredentialChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [field]: value
      }
    }));
  };

  const getPlatformLabel = () => {
    return deploymentOptions.find(option => option.id === answers.deploymentPlatform)?.label || '';
  };

  return (
    <div className="flex flex-col items-center space-y-6 overflow-hidden">
      {error && (
        <div className="text-red-500 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
      <div
        className={`transition-all duration-500 transform ${
          isAnimating ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {currentQuestion === 'deployment' && (
          <div className="text-center">
            <h1 className="text-white text-2xl mb-4">
              Where do you want to deploy?
            </h1>
            <div className="flex space-x-4 justify-center items-center">
              {deploymentOptions.map(option => (
                <Button
                  key={option.id}
                  onClick={() => handleDeploymentSelect(option.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg 
                           text-sm transition-colors duration-200"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {currentQuestion === 'credentials' && (
          <div className="text-center w-full max-w-md">
            <h1 className="text-white text-2xl mb-6">
              Enter {getPlatformLabel()} Credentials
            </h1>
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="flex space-x-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={answers.credentials.username}
                  onChange={(e) => handleCredentialChange('username', e.target.value)}
                  className="bg-slate-800 text-white border-blue-500 
                            placeholder:text-gray-400 text-sm"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={answers.credentials.password}
                  onChange={(e) => handleCredentialChange('password', e.target.value)}
                  className="bg-slate-800 text-white border-blue-500 
                            placeholder:text-gray-400 text-sm"
                />
              </div>
              <Input
                type="text"
                placeholder="Project Number"
                value={answers.credentials.projectNumber}
                onChange={(e) => handleCredentialChange('projectNumber', e.target.value)}
                className="bg-slate-800 text-white border-blue-500 
                          placeholder:text-gray-400 text-sm"
              />
              <Select 
                value={answers.credentials.region}
                onValueChange={(value) => handleCredentialChange('region', value)}
              >
                <SelectTrigger className="bg-slate-800 text-white border-blue-500">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 
                         rounded-lg text-sm transition-colors duration-200"
              >
                Continue
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentQuestions;