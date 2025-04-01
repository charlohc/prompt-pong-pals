
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
  const [simulatedPrompt, setSimulatedPrompt] = useState('');
  const [simulatedSubmitTime, setSimulatedSubmitTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { currentTeam, isCurrentPlayerActive, toggleMute, currentPlayer, gameState } = useGame();

  // Timer for countdown
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

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      if (isCurrentPlayerActive && prompt.trim()) {
        handleSubmit();
      } else if (!isCurrentPlayerActive && simulatedPrompt.trim()) {
        // Auto-submit teammate's prompt when time runs out
        onSubmit(simulatedPrompt.trim());
      }
    }
  }, [timeLeft, isCurrentPlayerActive, simulatedPrompt, prompt]);

  useEffect(() => {
    setPrompt(previousPrompt);
  }, [previousPrompt]);

  useEffect(() => {
    if (!disabled && inputRef.current && isCurrentPlayerActive) {
      inputRef.current.focus();
    }
  }, [disabled, isCurrentPlayerActive]);

  // Simulate context-aware typing from teammates with improved realism
  useEffect(() => {
    if (!isCurrentPlayerActive && currentTeam && gameState && !disabled) {
      const activePlayer = currentTeam.players[currentTeam.currentPlayerIndex];
      
      // Generate contextually relevant prompts based on the current challenge
      const potentialPrompts = getContextualPrompts(gameState.challenge, gameState.target);
      
      // Pick a random prompt for this teammate
      const randomPrompt = potentialPrompts[Math.floor(Math.random() * potentialPrompts.length)];
      
      // Set a random time for submission between 10 and 60 seconds
      const randomSubmitTime = Math.floor(10 + Math.random() * 50);
      setSimulatedSubmitTime(randomSubmitTime);
      
      // Create a more realistic typing simulation
      let currentText = '';
      let charIndex = 0;
      let typingSpeed = 70; // base typing speed in ms
      
      const simulateTyping = () => {
        if (charIndex < randomPrompt.length) {
          currentText += randomPrompt[charIndex];
          setSimulatedPrompt(currentText);
          charIndex++;
          
          // Vary typing speed slightly for realism
          const nextTypingDelay = typingSpeed + (Math.random() * 50 - 25);
          
          // Occasionally pause typing to simulate thinking
          if (Math.random() > 0.9) {
            setTimeout(simulateTyping, 800 + Math.random() * 1200);
          } 
          // Occasionally delete a few characters to simulate correction
          else if (charIndex > 5 && Math.random() > 0.95) {
            const deleteCount = Math.floor(1 + Math.random() * 3);
            currentText = currentText.slice(0, -deleteCount);
            setSimulatedPrompt(currentText);
            setTimeout(simulateTyping, 300 + Math.random() * 400);
          } 
          // Normal typing
          else {
            setTimeout(simulateTyping, nextTypingDelay);
          }
        }
      };
      
      // Start typing after a short delay
      setTimeout(simulateTyping, 1000 + Math.random() * 2000);
      
      return () => {
        setSimulatedPrompt('');
        setSimulatedSubmitTime(null);
      };
    }
  }, [isCurrentPlayerActive, currentTeam, gameState, disabled]);

  // Handle submission based on the simulated timer
  useEffect(() => {
    if (!isCurrentPlayerActive && simulatedSubmitTime !== null && !disabled) {
      const submitTimer = setTimeout(() => {
        if (simulatedPrompt.trim()) {
          onSubmit(simulatedPrompt.trim());
        }
      }, simulatedSubmitTime * 1000);
      
      return () => clearTimeout(submitTimer);
    }
  }, [simulatedSubmitTime, simulatedPrompt, isCurrentPlayerActive, onSubmit, disabled]);

  // Generate contextual prompts based on the current challenge
  const getContextualPrompts = (challenge: string, target: string) => {
    const lowerChallenge = challenge.toLowerCase();
    
    if (lowerChallenge.includes('space') || lowerChallenge.includes('adventure')) {
      return [
        "Describe a space adventure with starships traveling through nebulae",
        "Create a scene with alien worlds with bizarre landscapes waiting to be discovered",
        "Write about ancient cosmic mysteries lurking in the darkness between stars",
        "Describe a space adventure with both starships and alien civilizations",
        "Create a scene with interstellar explorers discovering ancient cosmic mysteries"
      ];
    } else if (lowerChallenge.includes('haunted') || lowerChallenge.includes('house')) {
      return [
        "Describe a decaying mansion with broken windows like hollow eyes",
        "Write about shadows shifting inside the mansion while floors creak",
        "Create a scene with distant whispers echoing through the cold, empty halls",
        "Describe the overgrown path leading to the haunted mansion",
        "Write about the eerie atmosphere surrounding the abandoned house"
      ];
    } else if (lowerChallenge.includes('mountain') || lowerChallenge.includes('landscape')) {
      return [
        "Describe a snow-capped mountain peak rising above a forest",
        "Create a scene with a clear blue sky and a lake reflecting the scenery",
        "Write about the tranquil beauty of mountains in the morning light",
        "Describe the majestic peaks towering over a peaceful valley",
        "Create a vivid description of mountain landscapes through the seasons"
      ];
    } else if (lowerChallenge.includes('city') || lowerChallenge.includes('futuristic')) {
      return [
        "Describe a gleaming metropolis with flying vehicles zooming between buildings",
        "Create a scene with holographic advertisements lighting up the cityscape",
        "Write about towering skyscrapers stretching into the clouds",
        "Describe the bustling streets of a future city with advanced technology",
        "Create a vivid picture of life in a futuristic urban environment"
      ];
    } else {
      // Generic prompts if challenge doesn't match any category
      return [
        `Describe a ${challenge} with vivid details about its most striking features`,
        `Create a detailed scene about ${challenge} with emphasis on atmosphere`,
        `Write a descriptive paragraph about ${challenge} that captures its essence`,
        `Detail the key elements of ${challenge} with sensory descriptions`,
        `Paint a picture with words about ${challenge} focusing on its unique aspects`
      ];
    }
  };

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

  // Calculate a progress indicator for teammate typing
  const getTeammateSubmitIndicator = () => {
    if (!simulatedSubmitTime || timeLeft > simulatedSubmitTime) return null;
    
    return (
      <span className="text-xs text-yellow-500 animate-pulse">
        Reviewing prompt...
      </span>
    );
  };

  return (
    <div className="relative w-full">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">
            {isCurrentPlayerActive ? 'Your turn' : `${currentTeam?.players[currentTeam?.currentPlayerIndex || 0].name}'s turn`}
          </span>
          {!isCurrentPlayerActive && getTeammateSubmitIndicator()}
        </div>
        <div className="text-sm text-yellow-400">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="relative">
        <Textarea
          ref={inputRef}
          value={isCurrentPlayerActive ? prompt : simulatedPrompt}
          onChange={(e) => isCurrentPlayerActive && setPrompt(e.target.value)}
          placeholder={isCurrentPlayerActive ? "Type your prompt here..." : ""}
          className={`w-full h-28 p-3 pr-10 bg-gray-700 text-white rounded-md prompt-font resize-none focus:outline-none focus:ring-2 ${
            isCurrentPlayerActive ? 'focus:ring-game-accent border-game-accent/50' : 'focus:ring-gray-600 border-gray-600'
          }`}
          disabled={disabled}
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
