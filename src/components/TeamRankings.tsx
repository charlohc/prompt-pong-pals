
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Trophy, Medal } from 'lucide-react';

const TeamRankings: React.FC = () => {
  const { gameState, currentTeam } = useGame();
  
  if (!gameState) return null;
  
  // Sort teams by score
  const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
  
  return (
    <div className="game-card">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Trophy size={18} className="text-yellow-400 mr-2" />
        Team Rankings
      </h3>
      
      <div className="space-y-3">
        {sortedTeams.map((team, index) => {
          const isCurrentTeam = team.id === currentTeam?.id;
          
          return (
            <div 
              key={team.id} 
              className={`flex items-center justify-between p-2 rounded-md ${
                isCurrentTeam ? 'bg-game-accent/20 border border-game-accent/30' : 'bg-gray-700/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6">
                  {index === 0 ? (
                    <Medal size={18} className="text-yellow-400" />
                  ) : index === 1 ? (
                    <Medal size={18} className="text-gray-400" />
                  ) : index === 2 ? (
                    <Medal size={18} className="text-amber-600" />
                  ) : (
                    <span className="text-sm text-gray-400">{index + 1}</span>
                  )}
                </div>
                <span className={isCurrentTeam ? 'font-bold' : ''}>
                  {team.name}{isCurrentTeam ? ' (You)' : ''}
                </span>
              </div>
              <div className="font-bold text-yellow-400">{team.score}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamRankings;
