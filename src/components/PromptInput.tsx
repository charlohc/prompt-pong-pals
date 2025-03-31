
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  previousPrompt?: string;
  timeLimit?: number;
  disabled?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  previousPrompt = '', 
  timeLimit = 60,
  disabled = false
}) => {
  const [prompt, setPrompt] = useState(previousPrompt);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    if (timeLeft === 0 && prompt.trim()) {
      handleSubmit();
    }
  }, [timeLeft]);

  useEffect(() => {
    setPrompt(previousPrompt);
  }, [previousPrompt]);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  const clearPrompt = () => {
    setPrompt('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <textarea
          ref={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          className="w-full h-20 p-3 pr-10 bg-gray-700 text-white rounded-md prompt-font resize-none focus:outline-none focus:ring-2 focus:ring-game-accent"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button 
          onClick={clearPrompt}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          type="button"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-sm text-gray-400">
          {disabled 
            ? "Waiting for your turn..." 
            : `Time left: ${timeLeft}s`
          }
        </div>
        <Button 
          onClick={handleSubmit} 
          className="bg-game-accent hover:bg-game-primary text-white"
          disabled={disabled || !prompt.trim()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;
