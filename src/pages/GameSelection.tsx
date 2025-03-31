
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { X, Info } from 'lucide-react';
import { GameType } from '@/contexts/GameContext';

const GameSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedGameType } = useGame();
  const [infoType, setInfoType] = useState<GameType | null>(null);

  const handleSelectGameType = (type: GameType) => {
    setSelectedGameType(type);
    navigate('/game-description');
  };

  const renderInfoModal = () => {
    if (!infoType) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="info-popup animate-fade-in relative max-w-md w-full mx-4">
          <button 
            onClick={() => setInfoType(null)} 
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            aria-label="Close info"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-xl font-bold mb-4">{infoType === 'image' ? 'Image Prompt' : 'Text Prompt'}</h3>
          
          <p className="text-gray-300">
            {infoType === 'image' 
              ? 'Players will receive an image and have to prompt to the AI so that it creates an more or less replica of the image given'
              : 'Players will receive an text and have to prompt to the AI so that it creates an more or less replica of the text given'
            }
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-game-background text-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-12 text-center">Select Game</h1>
        
        {renderInfoModal()}
        
        {!infoType && (
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <button 
                  onClick={() => handleSelectGameType('image')} 
                  className="w-32 h-32 game-card flex items-center justify-center hover:border-game-accent transition-colors"
                >
                  <div className="text-white">
                    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
                <button 
                  onClick={() => setInfoType('image')} 
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                >
                  <Info size={12} />
                </button>
              </div>
              <div className="text-lg font-semibold">Image Prompt</div>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <button 
                  onClick={() => handleSelectGameType('text')} 
                  className="w-32 h-32 game-card flex items-center justify-center hover:border-game-accent transition-colors"
                >
                  <div className="text-white">
                    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 9H16M8 13H14M20 16C20 16.5304 19.7893 17.0391 19.4142 17.4142C19.0391 17.7893 18.5304 18 18 18H6C5.46957 18 4.96086 17.7893 4.58579 17.4142C4.21071 17.0391 4 16.5304 4 16V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H18C18.5304 6 19.0391 6.21071 19.4142 6.58579C19.7893 6.96086 20 7.46957 20 8V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
                <button 
                  onClick={() => setInfoType('text')} 
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                >
                  <Info size={12} />
                </button>
              </div>
              <div className="text-lg font-semibold">Text Prompt</div>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button 
            onClick={() => navigate('/player-selection')} 
            className="text-gray-300 hover:text-white"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
