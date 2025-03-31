
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const JoinGame: React.FC = () => {
  const [gameCode, setGameCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { joinGame } = useGame();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (gameCode.length !== 6) {
      toast.error('Game code must be 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const success = await joinGame(gameCode);
      if (success) {
        toast.success('Joined game successfully!');
        navigate('/game-room');
      } else {
        toast.error('Invalid game code');
      }
    } catch (error) {
      toast.error('Failed to join game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold">Join Game</h2>
      
      <div className="flex space-x-2 items-center justify-center">
        <div className="flex items-center">
          {Array.from({ length: 6 }, (_, i) => (
            <React.Fragment key={i}>
              <input
                type="text"
                maxLength={1}
                className="w-12 h-16 text-center text-xl font-bold bg-game-primary border-2 border-game-accent rounded-md text-white focus:outline-none focus:ring-2 focus:ring-game-accent uppercase"
                value={gameCode[i] || ''}
                onChange={(e) => {
                  const newCode = gameCode.split('');
                  newCode[i] = e.target.value;
                  setGameCode(newCode.join(''));
                  
                  // Auto-focus next input
                  if (e.target.value && i < 5) {
                    const nextInput = e.target.parentElement?.nextElementSibling?.querySelector('input');
                    if (nextInput) {
                      (nextInput as HTMLInputElement).focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  // Handle backspace to focus previous input
                  if (e.key === 'Backspace' && !gameCode[i] && i > 0) {
                    const prevInput = e.target.parentElement?.previousElementSibling?.querySelector('input');
                    if (prevInput) {
                      (prevInput as HTMLInputElement).focus();
                    }
                  }
                }}
              />
              {i === 2 && <span className="mx-2 text-2xl text-white">-</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={handleJoin}
        disabled={gameCode.length !== 6 || isLoading}
        className="game-button w-40"
      >
        {isLoading ? 'Joining...' : 'JOIN'}
      </Button>
    </div>
  );
};

export default JoinGame;
