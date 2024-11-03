import React, { useState } from 'react';

const RetroButton = ({ onClick, fileInputRef, handleFolderSelect, onArrowClick }) => {
  const [selectedDir, setSelectedDir] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [showArrow, setShowArrow] = useState(true);

  const handleChange = (e) => {
    const directory = e.target.files[0]?.webkitRelativePath.split('/')[0];
    setSelectedDir(directory);
    handleFolderSelect(e);
  };

  const handleArrowClick = () => {
    if (selectedDir && !isLocked) {
      setIsLocked(true);
      setShowArrow(false);
      onArrowClick?.(selectedDir);
    }
  };

  // Pixelated arrow component
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
      <div className="flex items-center">
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

        <PixelArrow active={!!selectedDir && !isLocked} />

        {/* <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-400" /> */}
      </div>
    </div>
  );
};

export default RetroButton;