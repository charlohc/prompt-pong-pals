
import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGame } from '@/contexts/GameContext';

interface CollaborativePromptProps {
  onSubmit: (prompt: string) => void;
  previousPrompt?: string;
  timeLimit?: number;
  disabled?: boolean;
}

const CollaborativePrompt: React.FC<CollaborativePromptProps> = ({ 
  onSubmit, 
  previousPrompt = '', 
  timeLimit = 120,
  disabled = false
}) => {
  const [prompt, setPrompt] = useState(previousPrompt);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [typingActivity, setTypingActivity] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { currentTeam, isCurrentPlayerActive, toggleMute, currentPlayer } = useGame();

  useEffect(() => {
    if (disabled || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [disabled, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && prompt.trim() && isCurrentPlayerActive) {
      handleSubmit();
    }
  }, [timeLeft, isCurrentPlayerActive]);

  useEffect(() => {
    setPrompt(previousPrompt);
  }, [previousPrompt]);

  useEffect(() => {
    if (!disabled && inputRef.current && isCurrentPlayerActive) {
      inputRef.current.focus();
    }
  }, [disabled, isCurrentPlayerActive]);

  // Simulate typing activity from teammates
  useEffect(() => {
    if (!isCurrentPlayerActive && currentTeam) {
      const typingInterval = setInterval(() => {
        const shouldType = Math.random() > 0.7;
        if (shouldType) {
          const activePlayer = currentTeam.players[currentTeam.currentPlayerIndex];
          setTypingActivity(`${activePlayer.name} is typing...`);
          
          setTimeout(() => {
            setTypingActivity('');
          }, 2000);
        }
      }, 5000);
      
      return () => clearInterval(typingInterval);
    }
  }, [isCurrentPlayerActive, currentTeam]);

  const handleSubmit = () => {
    if (prompt.trim() && isCurrentPlayerActive) {
      onSubmit(prompt.trim());
    }
  };

  const clearPrompt = () => {
    if (isCurrentPlayerActive) {
      setPrompt('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-full">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">
            {isCurrentPlayerActive ? 'Your turn' : `${currentTeam?.players[currentTeam?.currentPlayerIndex || 0].name}'s turn`}
          </span>
          {typingActivity && <span className="text-sm text-gray-400">{typingActivity}</span>}
        </div>
        <div className="text-sm text-yellow-400">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="relative">
        <Textarea
          ref={inputRef}
          value={prompt}
          onChange={(e) => isCurrentPlayerActive && setPrompt(e.target.value)}
          placeholder={isCurrentPlayerActive ? "Type your prompt here..." : "Waiting for active player to type..."}
          className={`w-full h-28 p-3 pr-10 bg-gray-700 text-white rounded-md prompt-font resize-none focus:outline-none focus:ring-2 ${
            isCurrentPlayerActive ? 'focus:ring-game-accent border-game-accent/50' : 'focus:ring-gray-600 border-gray-600 opacity-80'
          }`}
          disabled={!isCurrentPlayerActive || disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey && isCurrentPlayerActive) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        {isCurrentPlayerActive && (
          <button 
            onClick={clearPrompt}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex space-x-2">
          {currentPlayer && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => currentPlayer && toggleMute(currentPlayer.id, currentTeam?.id || 0)}
              className={`flex items-center space-x-1 ${currentPlayer.isMuted ? 'text-red-400 border-red-400/30' : 'text-green-400 border-green-400/30'}`}
            >
              {currentPlayer.isMuted ? (
                <>
                  <MicOff size={14} />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Mic size={14} />
                  <span>Mute</span>
                </>
              )}
            </Button>
          )}
        </div>
        
        <Button 
          onClick={handleSubmit} 
          className="bg-game-accent hover:bg-game-primary text-white"
          disabled={!isCurrentPlayerActive || disabled || !prompt.trim()}
        >
          <SendIcon size={16} className="mr-1" />
          Submit
        </Button>
      </div>
      
      {currentTeam && (
        <div className="mt-4 flex flex-wrap gap-2">
          <p className="w-full text-sm text-gray-400 mb-1">Team Voice Chat:</p>
          {currentTeam.players.map(player => (
            <div 
              key={player.id}
              className={`text-xs rounded px-2 py-1 flex items-center space-x-1 ${
                player.id === currentPlayer?.id 
                  ? 'bg-game-accent/20 border border-game-accent/30' 
                  : 'bg-gray-700'
              }`}
            >
              <span>{player.name}</span>
              {player.isMuted ? 
                <MicOff size={12} className="text-red-400" /> : 
                <Mic size={12} className="text-green-400" />
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborativePrompt;
