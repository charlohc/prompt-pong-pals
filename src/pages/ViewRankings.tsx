
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Home, RotateCcw } from 'lucide-react';

const ViewRankings: React.FC = () => {
  const { gameState, resetGame } = useGame();
  const navigate = useNavigate();
  const [rankings, setRankings] = useState<{name: string, score: number, position: number}[]>([]);
  
  useEffect(() => {
    if (!gameState) {
      navigate('/');
      return;
    }
    
    // Create a randomized ranking for all teams
    const teamRankings = gameState.teams.map(team => ({
      name: team.name,
      score: team.score,
      position: 0 // Will be set later
    }));
    
    // Randomize the order of completion (simulating which team finished first)
    const randomRankings = [...teamRankings].sort(() => Math.random() - 0.5);
    
    // Assign positions based on random ordering
    randomRankings.forEach((team, index) => {
      team.position = index + 1;
    });
    
    // Then sort by position for display
    setRankings(randomRankings.sort((a, b) => a.position - b.position));
  }, [gameState, navigate]);
  
  if (!gameState) {
    return null;
  }
  
  const getPositionDisplay = (position: number) => {
    switch (position) {
      case 1:
        return { text: "1st", icon: <Medal size={18} className="text-yellow-400 mr-2" /> };
      case 2:
        return { text: "2nd", icon: <Medal size={18} className="text-gray-400 mr-2" /> };
      case 3:
        return { text: "3rd", icon: <Medal size={18} className="text-amber-600 mr-2" /> };
      default:
        return { text: `${position}th`, icon: null };
    }
  };
  
  return (
    <div className="min-h-screen bg-game-background text-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex justify-center items-center">
            <Trophy size={30} className="text-yellow-400 mr-3" />
            Team Rankings
          </h1>
          <p className="text-gray-400">
            See how your team performed against others
          </p>
        </div>
        
        <div className="game-card bg-gray-800/50 mb-8">
          <div className="space-y-6">
            {rankings.map((team) => {
              const position = getPositionDisplay(team.position);
              const isUserTeam = team.name === gameState.teams[0].name;
              
              return (
                <div 
                  key={team.name}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    isUserTeam 
                      ? 'bg-game-accent/20 border border-game-accent/30' 
                      : 'bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center">
                    {position.icon}
                    <div>
                      <div className="font-bold text-xl">
                        {position.text} Place
                      </div>
                      <div className={`${isUserTeam ? 'text-game-accent' : 'text-gray-300'}`}>
                        {team.name} {isUserTeam && '(Your Team)'}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {team.score} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-center space-x-6">
          <Button 
            onClick={() => navigate('/game-room')}
            className="bg-game-accent hover:bg-game-primary text-white flex items-center"
          >
            <RotateCcw size={18} className="mr-2" />
            Play Again
          </Button>
          
          <Button 
            onClick={() => {
              resetGame();
              navigate('/');
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white flex items-center"
          >
            <Home size={18} className="mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewRankings;
