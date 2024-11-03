import React, { useState } from 'react';

const RetroButton = ({ onClick, fileInputRef, handleFolderSelect, onArrowClick }) => {
  const [selectedDir, setSelectedDir] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const [error, setError] = useState(null);

  const sendPathToServer = async (path) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/set_file_path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: path }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
      return data;
    } catch (error) {
      console.error('Error sending path to server:', error);
      setError('Failed to send path to server');
      throw error;
    }
  };

  const handleChange = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const directory = files[0].webkitRelativePath.split('/')[0];
      const fullPath = files[0].webkitRelativePath;
      console.log(fullPath);
      
      // Log paths of all selected files
      Array.from(files).forEach((file, index) => {
        if (index < 5) {
          console.log(`File ${index + 1} path:`, file.webkitRelativePath);
        }
      });
      
      try {
        await sendPathToServer(directory);
        setSelectedDir(directory);
        handleFolderSelect(e);
      } catch (error) {
        // Error is already handled in sendPathToServer
        return;
      }
    }
  };

  const handleArrowClick = () => {
    if (selectedDir && !isLocked && !error) {
      console.log('Arrow clicked for directory:', selectedDir);
      setIsLocked(true);
      setShowArrow(false);
      onArrowClick?.(selectedDir);
    }
  };

  // Pixelated arrow component remains the same
  const PixelArrow = ({ active }) => (
    <div 
      onClick={handleArrowClick}
      className={`
        ml-2 
        inline-block 
        transition-all duration-300
        ${active ? 'cursor-pointer opacity-100 hover:scale-110' : 'cursor-default opacity-30'}
        ${showArrow ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
        select-none
      `}
    >
      <div className={`relative w-6 h-6 ${showArrow ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
        <div className="absolute top-2 left-0 w-4 h-2 bg-blue-400"></div>
        <div className="absolute top-0 left-2 w-2 h-2 bg-blue-400"></div>
        <div className="absolute top-4 left-2 w-2 h-2 bg-blue-400"></div>
        <div className="absolute top-1 left-3 w-2 h-4 bg-blue-400"></div>
      </div>
    </div>
  );

  return (
    <div className={`
      transition-all duration-1000 transform relative
      ${isLocked ? '-translate-y-[50vh]' : ''}
    `}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        webkitdirectory="true"
        directory="true"
        multiple
      />
      <div className="flex items-center flex-col">
        <button
          onClick={!isLocked ? onClick : undefined}
          className={`
            relative
            min-w-[200px]
            px-8 py-3
            font-mono text-lg
            text-blue-400
            transition-all duration-100
            ${isLocked ? 'cursor-default' : ''}
            
            bg-black
            border-2
            border-b-4
            border-r-4
            border-blue-400
            
            before:content-['']
            before:absolute
            before:top-0
            before:left-[4px]
            before:right-[4px]
            before:h-[2px]
            before:bg-blue-300
            
            after:content-['']
            after:absolute
            after:top-[4px]
            after:left-0
            after:w-[2px]
            after:bottom-[4px]
            after:bg-blue-300
            
            ${!isLocked ? `
              hover:translate-x-[2px]
              hover:translate-y-[2px]
              hover:border-b-2
              hover:border-r-2
              active:translate-x-[4px]
              active:translate-y-[4px]
              active:border-b-0
              active:border-r-0
            ` : ''}
          `}
        >
          <div className="absolute inset-[4px] border border-blue-400 pointer-events-none" />
          
          <div className="relative z-10 uppercase tracking-wider font-pressStart truncate">
            {selectedDir || 'Select Folder'}
          </div>
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <PixelArrow active={!!selectedDir && !isLocked && !error} />
      </div>
    </div>
  );
};

export default RetroButton;