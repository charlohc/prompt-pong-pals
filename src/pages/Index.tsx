
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { resetGame } = useGame();

  const handleJoin = () => {
    resetGame();
    navigate('/join');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-game-background text-white p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold mb-8 text-gray-100">Pong.AI</h1>
        
        <div className="mb-12 relative">
          <div className="w-56 h-24 mx-auto border-2 border-white flex">
            <div className="w-1/2 border-r-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-ping-pong"></div>
            </div>
            <div className="w-1/2"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button onClick={handleJoin} className="game-button w-full py-3">
            JOIN
          </Button>
          
          <Button 
            onClick={() => window.close()} 
            className="game-button w-full py-3 bg-gray-700 hover:bg-gray-600"
          >
            QUIT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
