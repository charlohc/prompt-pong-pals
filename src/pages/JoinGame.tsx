
import React from 'react';
import PinEntry from '@/components/PinEntry';

const JoinGame: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-game-background">
      <PinEntry />
    </div>
  );
};

export default JoinGame;
