
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const PinEntry: React.FC = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { joinGame } = useGame();
  const navigate = useNavigate();
  
  const handleJoin = async () => {
    if (pin.length !== 6) {
      toast.error('Game PIN must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const success = await joinGame(pin);
      if (success) {
        toast.success('Joined game successfully!');
        navigate('/team-setup');
      } else {
        toast.error('Invalid game PIN');
      }
    } catch (error) {
      toast.error('Failed to join game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-4xl font-bold text-center">Enter Game PIN</h2>
      <p className="text-gray-400 text-center">Ask your host for the game PIN</p>
      
      <div className="my-8">
        <InputOTP
          maxLength={6}
          value={pin}
          onChange={setPin}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, i) => (
                <InputOTPSlot
                  key={i}
                  {...slot}
                  index={i} // Add the missing index prop
                />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>
      
      <div className="text-center mt-2 text-sm text-gray-400">
        <p>For demo purposes, try PIN: 123456</p>
      </div>
      
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Button 
          onClick={handleJoin}
          disabled={pin.length !== 6 || isLoading}
          className="game-button w-full"
        >
          {isLoading ? 'Joining...' : 'ENTER'}
        </Button>
        
        <Button 
          onClick={() => navigate('/')} 
          className="game-button w-full"
        >
          BACK TO MAIN MENU
        </Button>
      </div>
    </div>
  );
};

export default PinEntry;
