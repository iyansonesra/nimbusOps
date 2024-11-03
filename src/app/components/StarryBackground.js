import React, { useMemo } from 'react';

const StarryBackground = () => {
  // Generate random stars
  const stars = useMemo(() => {
    const starCount = 100;
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() < 0.3 ? 2 : 1, // 30% chance of being a larger star
      animationDelay: `${Math.random() * 3}s`,
      // Different movement ranges for variety
      moveRange: Math.random() < 0.5 ? 'small' : 'medium',
      // Random initial animation phase (0-2s) for more natural movement
      driftDelay: `${Math.random() * 2}s`,
    })); 
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute bg-white animate-twinkle ${
            star.moveRange === 'small' ? 'animate-drift-small' : 'animate-drift-medium'
          }`}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.animationDelay}, ${star.driftDelay}`,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;