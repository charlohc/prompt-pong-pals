
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import TeamRankings from '@/components/TeamRankings';
import { Sparkles, ThumbsUp, Send, ChevronRight, Users, Check, Clock } from 'lucide-react';

const PostGameChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { gameState, resetGame } = useGame();
  
  if (!gameState) {
    navigate('/');
    return null;
  }
  
  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to a backend
      setMessage('');
    }
  };
  
  // Example data for post-game stats - normally these would come from gameState
  const successRate = 65;
  const responseTime = 48;
  const promptRevisions = 3;
  
  // Get team scores from gameState
  const teamScores = gameState.teams.map(team => ({
    name: team.name,
    score: team.score
  }));
  
  // Sort teams by score
  const sortedTeams = [...teamScores].sort((a, b) => b.score - a.score);
  const winningTeam = sortedTeams[0];
  
  return (
    <div className="min-h-screen bg-game-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Game Over!</h1>
          <Button variant="outline" onClick={() => navigate('/')} className="bg-game-primary text-white">
            Back to Menu
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Team rankings */}
          <div className="space-y-6">
            <div className="game-card">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Sparkles size={20} className="text-yellow-400 mr-2" />
                Winner: {winningTeam.name}
              </h2>
              <div className="p-4 bg-game-accent/20 rounded-md">
                <p className="text-lg font-semibold">Score: {winningTeam.score}</p>
                <p className="text-gray-400">Congratulations!</p>
              </div>
            </div>
            
            <TeamRankings />
          </div>
          
          {/* Middle column - Game stats */}
          <div className="space-y-6">
            <div className="game-card">
              <h2 className="text-2xl font-bold mb-4">Game Performance</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{successRate}%</span>
                    <ThumbsUp size={16} className="ml-2 text-green-500" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg. Response Time</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{responseTime}s</span>
                    <Clock size={16} className="ml-2 text-blue-500" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Prompt Revisions</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{promptRevisions}</span>
                    <Check size={16} className="ml-2 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="game-card">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Users size={18} className="mr-2" />
                Team Participation
              </h2>
              
              <div className="space-y-3">
                {gameState.teams.map(team => (
                  <div key={team.id} className="p-3 bg-gray-800 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{team.name}</span>
                      <span className="text-yellow-400">{team.score} pts</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {team.players.length} members, {team.prompts.length} prompt{team.prompts.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Chat */}
          <div className="game-card">
            <h2 className="text-2xl font-bold mb-4">Team Chat</h2>
            
            <div className="h-96 overflow-y-auto mb-4 p-3 bg-gray-800 rounded-md flex flex-col">
              {/* Sample messages - in a real app these would come from a chat history */}
              <div className="chat-message other">
                <div className="text-xs text-gray-500 mb-1">Team Leader</div>
                <div className="message-bubble">Great job everyone! We made it to the top 3.</div>
              </div>
              
              <div className="chat-message other mt-3">
                <div className="text-xs text-gray-500 mb-1">Sarah</div>
                <div className="message-bubble">That last prompt was tricky!</div>
              </div>
              
              <div className="chat-message self mt-3 ml-auto">
                <div className="text-xs text-gray-500 mb-1 text-right">You</div>
                <div className="message-bubble bg-game-accent/30">I think we did really well with the descriptions.</div>
              </div>
              
              <div className="chat-message other mt-3">
                <div className="text-xs text-gray-500 mb-1">Mike</div>
                <div className="message-bubble">Should we play another round?</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white p-3 rounded-l-md focus:outline-none"
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-game-accent hover:bg-game-accent/80 rounded-l-none"
              >
                <Send size={18} />
              </Button>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-700">
              <Button 
                onClick={resetGame}
                className="w-full bg-game-primary hover:bg-game-primary/80 flex items-center justify-center"
              >
                <span>Play Again</span>
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostGameChat;
