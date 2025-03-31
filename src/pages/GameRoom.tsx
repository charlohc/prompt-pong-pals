
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import PromptInput from '@/components/PromptInput';
import AIResponse from '@/components/AIResponse';
import PlayerTurn from '@/components/PlayerTurn';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const GameRoom: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, submitPrompt, startNewRound, resetGame } = useGame();
  const [submittedPrompt, setSubmittedPrompt] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [playerTyping, setPlayerTyping] = useState(false);
  
  useEffect(() => {
    if (!gameState) {
      navigate('/');
      return;
    }
  }, [gameState, navigate]);
  
  useEffect(() => {
    if (submittedPrompt) {
      const showResponseTimer = setTimeout(() => {
        setShowAIResponse(true);
        setInputDisabled(true);
      }, 1000);
      
      return () => clearTimeout(showResponseTimer);
    }
  }, [submittedPrompt]);
  
  // Simulate random typing from other players
  useEffect(() => {
    if (gameState && !submittedPrompt && !showAIResponse) {
      const typingInterval = setInterval(() => {
        setPlayerTyping(Math.random() > 0.7);
      }, 2000);
      
      return () => clearInterval(typingInterval);
    }
  }, [gameState, submittedPrompt, showAIResponse]);
  
  if (!gameState) {
    return <div>Loading...</div>;
  }
  
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  const handlePromptSubmit = async (prompt: string) => {
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
    if (gameState.prompts.length === 0) {
      return '';
    }
    return gameState.prompts[gameState.prompts.length - 1].text;
  };
  
  const getLatestResponse = () => {
    if (gameState.prompts.length === 0 || !gameState.prompts[gameState.prompts.length - 1].aiResponse) {
      return '';
    }
    return gameState.prompts[gameState.prompts.length - 1].aiResponse as string;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-game-background text-white p-4">
      <div className="max-w-4xl mx-auto w-full flex-1 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="game-card">
            <h2 className="text-xl font-semibold mb-2">
              Make the AI recite this text, by typing in the prompt!
            </h2>
            
            <div className="game-card bg-indigo-900/40 prompt-font">
              <h3 className="font-bold text-indigo-300 mb-1">{gameState.challenge}</h3>
              <p>{gameState.target}</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="border-b border-gray-700 mb-4"></div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-game-background px-4">
              {isRoundComplete ? 'Complete!' : `${30}s`}
            </div>
          </div>
          
          {playerTyping && !submittedPrompt && (
            <div className="text-gray-400 text-center">
              Player {(gameState.currentPlayerIndex + 1)} is typing...
            </div>
          )}
          
          {showAIResponse ? (
            <AIResponse 
              response={getLatestResponse()} 
              success={isRoundComplete}
              feedbackMessage={isRoundComplete 
                ? `Congratulations! You did it in ${gameState.prompts.length} ${gameState.prompts.length === 1 ? 'round' : 'rounds'}!` 
                : 'Your prompt will be served to the next player!'
              }
            />
          ) : (
            <PromptInput 
              onSubmit={handlePromptSubmit} 
              previousPrompt={submittedPrompt ? getLatestPrompt() : ''}
              disabled={inputDisabled}
            />
          )}
          
          {isRoundComplete && (
            <div className="text-center mt-6">
              <Button 
                onClick={handleNextRound}
                className="game-button"
              >
                {gameState.gameOver ? 'Finish Game' : 'Next Round'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <PlayerTurn 
            players={gameState.players} 
            currentPlayerIndex={gameState.currentPlayerIndex}
            currentPlayer={currentPlayer}
          />
          
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
                <span className="text-gray-400">Players:</span>
                <span>{gameState.players.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Game ID:</span>
                <span className="font-mono text-xs">{gameState.gameId}</span>
              </div>
            </div>
          </div>
          
          <div className="game-card">
            <h3 className="text-lg font-semibold mb-2">Current Score</h3>
            <div className="text-3xl font-bold text-center text-yellow-400">
              {gameState.score}
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
              Quit Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
