
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';

const GameDescription: React.FC = () => {
  const navigate = useNavigate();
  const { playerCount, selectedGameType, createGame } = useGame();
  
  const handleStartGame = () => {
    if (selectedGameType) {
      createGame(selectedGameType, playerCount);
      navigate('/game-room');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-game-background text-white p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold mb-8 text-center">Game Description</h1>
        
        <div className="game-card mb-8">
          <div className="text-center space-y-6 p-4">
            <p className="text-lg">
              One player starts with a description of what the AI should generate and writes an initial prompt.
            </p>
            
            <p className="text-lg">
              The next player refines it, and they take turns improving the prompt until the AI approves.
            </p>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <Button 
            onClick={handleStartGame} 
            className="game-button w-40 py-3"
          >
            READY
          </Button>
          
          <div>
            <Button 
              onClick={() => navigate('/game-selection')} 
              className="text-gray-300 hover:text-white"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDescription;
