
import React from 'react';
import { Player } from '@/contexts/GameContext';

interface PlayerTurnProps {
  players: Player[];
  currentPlayerIndex: number;
  currentPlayer: Player;
}

const PlayerTurn: React.FC<PlayerTurnProps> = ({ 
  players, 
  currentPlayerIndex,
  currentPlayer 
}) => {
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
  
  return (
    <div className="game-card">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">You are</span>
          <span className="font-bold text-game-accent">{currentPlayer.name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Now:</span>
          <span className="font-bold text-yellow-400">Your turn</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Next:</span>
          <span className="font-bold text-green-400">{players[nextPlayerIndex].name}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerTurn;
