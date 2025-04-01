
import React, { useEffect, useState } from 'react';

interface GameTimerProps {
  seconds: number;
  onComplete?: () => void;
  running?: boolean;
  randomEndTime?: number;
}

const GameTimer: React.FC<GameTimerProps> = ({ 
  seconds, 
  onComplete,
  running = true,
  randomEndTime
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    if (!running) return;
    
    if (timeLeft <= 0 || (randomEndTime && timeLeft <= randomEndTime)) {
      onComplete?.();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onComplete, running, randomEndTime]);
  
  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);
  
  return (
    <div className="flex justify-center items-center my-4">
      <div className="text-2xl font-bold">{timeLeft}s</div>
    </div>
  );
};

export default GameTimer;
