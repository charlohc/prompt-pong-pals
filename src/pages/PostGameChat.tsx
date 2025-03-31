
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import PromptHistory from '@/components/PromptHistory';
import { Send, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  playerId: number;
  playerName: string;
  message: string;
  timestamp: Date;
}

const PostGameChat: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGame();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  
  if (!gameState) {
    navigate('/');
    return null;
  }
  
  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      playerId: gameState.players[0].id, // Current player as Player 1
      playerName: gameState.players[0].name,
      message: messageInput,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessageInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-game-background text-white p-4">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center">Chat</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="game-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Chat</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-gray-400 italic">
                Here you can chat about what you prompted and why
              </p>
              <p className="text-gray-400 italic">
                You can also see the history in prompts in the game
              </p>
              
              {chatMessages.map(msg => (
                <div key={msg.id} className="flex space-x-2">
                  <div className="flex-shrink-0 bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-game-accent">{msg.playerName}</span>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-gray-200">{msg.message}</p>
                  </div>
                </div>
              ))}
              
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 my-8">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-700">
              <div className="flex space-x-2">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 text-white rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-game-accent"
                  rows={2}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!messageInput.trim()}
                  className="p-2 text-white bg-game-accent hover:bg-game-primary"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="game-card">
              <h2 className="text-xl font-semibold mb-4">Game Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Final Score:</span>
                  <span className="font-bold text-yellow-400">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rounds Played:</span>
                  <span>{gameState.currentRound}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game Type:</span>
                  <span className="capitalize">{gameState.gameType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Players:</span>
                  <span>{gameState.players.length}</span>
                </div>
              </div>
            </div>
            
            <div className="game-card overflow-auto max-h-96">
              <h2 className="text-xl font-semibold mb-4">Prompt History</h2>
              {gameState.prompts.length > 0 ? (
                <PromptHistory prompts={gameState.prompts} />
              ) : (
                <p className="text-gray-400 italic">No prompts in history</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 space-x-4">
          <Button 
            onClick={() => {
              resetGame();
              navigate('/');
            }}
            className="game-button"
          >
            Main Menu
          </Button>
          
          <Button 
            onClick={() => {
              resetGame();
              navigate('/player-selection');
            }}
            className="game-button"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostGameChat;
