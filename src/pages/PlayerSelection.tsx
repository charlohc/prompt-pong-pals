
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { PlayerNumber } from '@/contexts/GameContext';

const PlayerSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setPlayerCount } = useGame();

  const handleSelectPlayers = (count: PlayerNumber) => {
    setPlayerCount(count);
    navigate('/game-selection');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-game-background text-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-12 text-center">Select Players</h1>
        
        <div className="space-y-6">
          <Button 
            onClick={() => handleSelectPlayers(2)} 
            className="w-full py-4 text-xl game-button bg-green-600 hover:bg-green-700"
          >
            2 PLAYER
          </Button>
          
          <Button 
            onClick={() => handleSelectPlayers(3)} 
            className="w-full py-4 text-xl game-button bg-yellow-600 hover:bg-yellow-700"
          >
            3 PLAYER
          </Button>
          
          <Button 
            onClick={() => handleSelectPlayers(4)} 
            className="w-full py-4 text-xl game-button bg-purple-600 hover:bg-purple-700"
          >
            4 PLAYER
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={() => navigate('/')} 
            className="text-gray-300 hover:text-white"
          >
            Back to Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelection;
