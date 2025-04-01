
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Users } from 'lucide-react';
import { toast } from 'sonner';

const TeamSetup: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, setTeamName, toggleMute, resetGame, currentTeam } = useGame();
  const [teamName, setTeamNameInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (!gameState) {
      navigate('/');
      return;
    }
    
    if (currentTeam) {
      setTeamNameInput(currentTeam.name);
    }
  }, [gameState, navigate, currentTeam]);
  
  if (!gameState || !currentTeam) {
    return <div>Loading...</div>;
  }
  
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamNameInput(e.target.value);
  };
  
  const handleTeamNameSubmit = () => {
    if (teamName.trim()) {
      setTeamName(currentTeam.id, teamName.trim());
      toast.success('Team name updated!');
      setIsReady(true);
    } else {
      toast.error('Please enter a team name');
    }
  };
  
  const handleStartGame = () => {
    if (isReady) {
      // Update game state to started
      navigate('/game-room');
    } else {
      toast.error('Please set your team name first');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-game-background text-white p-4">
      <div className="max-w-4xl mx-auto w-full flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">Team Setup</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="game-card">
              <h2 className="text-xl font-semibold mb-4">Your Team</h2>
              
              <div className="flex items-center space-x-3 mb-4">
                <Input
                  value={teamName}
                  onChange={handleTeamNameChange}
                  placeholder="Enter team name..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button onClick={handleTeamNameSubmit}>Set</Button>
              </div>
              
              <div className="space-y-3">
                {currentTeam.players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center p-2 bg-gray-700/50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${player.id === 1 ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                      <span className={player.id === 1 ? 'text-yellow-400' : ''}>{player.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleMute(player.id, currentTeam.id)}
                      className={player.isMuted ? 'text-red-400' : 'text-green-400'}
                    >
                      {player.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                className="game-button w-full"
                onClick={handleStartGame}
                disabled={!isReady}
              >
                START GAME
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="game-card">
              <h2 className="text-xl font-semibold mb-4">Other Teams</h2>
              <div className="space-y-4">
                {gameState.teams.filter(team => team.id !== currentTeam.id).map(team => (
                  <div key={team.id} className="p-3 bg-gray-700/30 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold">{team.name}</div>
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Users size={14} />
                        <span>{team.players.length}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {team.players.map(player => (
                        <div 
                          key={player.id} 
                          className="text-xs bg-gray-700 rounded px-2 py-1 flex items-center"
                        >
                          {player.name}
                          {player.isMuted ? <MicOff size={12} className="ml-1 text-red-400" /> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-md p-4">
              <h3 className="font-semibold mb-2">Voice Chat Guidelines</h3>
              <ul className="text-sm space-y-2 text-gray-300">
                <li>• Use the mute button when not speaking to reduce background noise</li>
                <li>• Speak clearly and take turns when discussing</li>
                <li>• Be respectful of teammates' ideas</li>
                <li>• Collaborate on prompt ideas to maximize success</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => {
              resetGame();
              navigate('/');
            }}
            className="text-gray-400 hover:text-white"
          >
            Leave Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamSetup;
