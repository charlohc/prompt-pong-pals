
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import CollaborativePrompt from '@/components/CollaborativePrompt';
import AIResponse from '@/components/AIResponse';
import TeamRankings from '@/components/TeamRankings';
import TeamFeedback from '@/components/TeamFeedback';
import { Button } from '@/components/ui/button';
import { Users, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

const GameRoom: React.FC = () => {
  const navigate = useNavigate();
  const { 
    gameState, 
    submitPrompt, 
    startNewRound, 
    resetGame, 
    currentTeam,
    currentPlayer,
    isCurrentPlayerActive
  } = useGame();
  
  const [submittedPrompt, setSubmittedPrompt] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  
  useEffect(() => {
    if (!gameState || !currentTeam) {
      navigate('/');
      return;
    }
  }, [gameState, navigate, currentTeam]);
  
  useEffect(() => {
    if (submittedPrompt) {
      const showResponseTimer = setTimeout(() => {
        setShowAIResponse(true);
        setInputDisabled(true);
      }, 1000);
      
      return () => clearTimeout(showResponseTimer);
    }
  }, [submittedPrompt]);
  
  if (!gameState || !currentTeam || !currentPlayer) {
    return <div>Loading...</div>;
  }
  
  const handlePromptSubmit = async (prompt: string) => {
    if (!isCurrentPlayerActive) {
      toast.error("It's not your turn to submit!");
      return;
    }
    
    setSubmittedPrompt(true);
    
    const success = await submitPrompt(prompt);
    
    if (success) {
      setIsRoundComplete(true);
      toast.success('Your prompt was successful!');
    } else {
      toast.info('Prompt submitted but not quite there yet. Next player\'s turn!');
      setTimeout(() => {
        setSubmittedPrompt(false);
        setShowAIResponse(false);
        setInputDisabled(false);
      }, 3000);
    }
  };
  
  const handleNextRound = () => {
    if (gameState.gameOver) {
      navigate('/post-game-chat');
    } else {
      startNewRound();
      setSubmittedPrompt(false);
      setShowAIResponse(false);
      setIsRoundComplete(false);
      setInputDisabled(false);
    }
  };
  
  const getLatestPrompt = () => {
    if (currentTeam.prompts.length === 0) {
      return '';
    }
    return currentTeam.prompts[currentTeam.prompts.length - 1].text;
  };
  
  const getLatestResponse = () => {
    if (currentTeam.prompts.length === 0 || !currentTeam.prompts[currentTeam.prompts.length - 1].aiResponse) {
      return '';
    }
    return currentTeam.prompts[currentTeam.prompts.length - 1].aiResponse as string;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-game-background text-white p-4">
      <div className="max-w-4xl mx-auto w-full flex-1 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="game-card">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">
                Team Challenge
              </h2>
              <div className="flex items-center text-sm text-gray-400">
                <Clock size={14} className="mr-1" />
                <span>Round {gameState.currentRound}/{gameState.totalRounds}</span>
              </div>
            </div>
            
            <div className="game-card bg-indigo-900/40 prompt-font">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-indigo-300">{gameState.challenge}</h3>
                <div className="text-xs bg-indigo-800/60 px-2 py-0.5 rounded-full">
                  <Target size={12} className="inline mr-1" />
                  Target Text
                </div>
              </div>
              <p>{gameState.target}</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="border-b border-gray-700 mb-4"></div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-game-background px-4">
              <div className="flex items-center space-x-2">
                <Users size={14} />
                <span>{isRoundComplete ? 'Team Success!' : `${currentTeam.name} Collaboration`}</span>
              </div>
            </div>
          </div>
          
          {showAIResponse ? (
            <AIResponse 
              response={getLatestResponse()} 
              success={isRoundComplete}
              feedbackMessage={isRoundComplete 
                ? `Team ${currentTeam.name} completed the challenge in ${currentTeam.prompts.length} ${currentTeam.prompts.length === 1 ? 'attempt' : 'attempts'}!` 
                : "Not quite there! Next teammate's turn"
              }
            />
          ) : (
            <CollaborativePrompt 
              onSubmit={handlePromptSubmit} 
              previousPrompt={submittedPrompt ? getLatestPrompt() : ''}
              disabled={inputDisabled}
            />
          )}
          
          {isRoundComplete && (
            <div className="text-center mt-6">
              <TeamFeedback 
                success={true}
                prompts={currentTeam.prompts}
                challenge={gameState.challenge}
              />
              
              <Button 
                onClick={handleNextRound}
                className="game-button mt-6"
              >
                {gameState.gameOver ? 'See Final Results' : 'Next Challenge'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="game-card">
            <h3 className="text-lg font-semibold mb-2">Game Info</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Round:</span>
                <span>{gameState.currentRound} / {gameState.totalRounds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mode:</span>
                <span className="capitalize">{gameState.gameType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Team:</span>
                <span>{currentTeam.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Teams:</span>
                <span>{gameState.teams.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Game PIN:</span>
                <span className="font-mono text-xs">{gameState.gamePin}</span>
              </div>
            </div>
          </div>
          
          <TeamRankings />
          
          <div className="game-card">
            <h3 className="text-lg font-semibold mb-2">Your Team</h3>
            <div className="space-y-2">
              {currentTeam.players.map((player, index) => {
                const isActive = currentTeam.currentPlayerIndex === index;
                return (
                  <div 
                    key={player.id} 
                    className={`flex justify-between items-center p-2 rounded-md ${
                      isActive ? 'bg-game-accent/20' : 'bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                      <span className={player.id === currentPlayer.id ? 'text-yellow-400' : ''}>
                        {player.name} {player.id === currentPlayer.id ? '(You)' : ''}
                      </span>
                    </div>
                    <div className="text-xs">
                      {isActive ? 'Active' : index === (currentTeam.currentPlayerIndex + 1) % currentTeam.players.length ? 'Next' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Button 
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
    </div>
  );
};

export default GameRoom;
