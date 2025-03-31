
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type GameType = 'text' | 'image';
export type PlayerNumber = 2 | 3 | 4;

export interface Prompt {
  text: string;
  player: number;
  aiResponse?: string;
  success?: boolean;
}

export interface Player {
  id: number;
  name: string;
}

export interface GameState {
  gameId: string;
  players: Player[];
  currentPlayerIndex: number;
  gameType: GameType;
  challenge: string;
  target: string;
  prompts: Prompt[];
  currentRound: number;
  totalRounds: number;
  gameOver: boolean;
  score: number;
}

interface GameContextType {
  gameState: GameState | null;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  playerCount: PlayerNumber;
  setPlayerCount: React.Dispatch<React.SetStateAction<PlayerNumber>>;
  selectedGameType: GameType | null;
  setSelectedGameType: React.Dispatch<React.SetStateAction<GameType | null>>;
  createGame: (type: GameType, playerCount: PlayerNumber) => void;
  joinGame: (gameId: string) => Promise<boolean>;
  submitPrompt: (prompt: string) => Promise<boolean>;
  startNewRound: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerCount, setPlayerCount] = useState<PlayerNumber>(2);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);

  // Mock challenges for demo purposes
  const textChallenges = [
    {
      challenge: "Haunted House",
      target: "A decaying mansion stands at the end of an overgrown path, its broken windows like hollow eyes. Inside, shadows shift, floors creak, and distant whispers echo through the cold, empty halls."
    },
    {
      challenge: "Space Adventure",
      target: "Starships streak across the void, their engines glowing against the backdrop of nebulae. Alien worlds with bizarre landscapes wait to be discovered, while ancient cosmic mysteries lurk in the darkness between stars."
    }
  ];

  const imageChallenges = [
    {
      challenge: "Mountain Landscape",
      target: "A snow-capped mountain peak rising above a forest, with a clear blue sky and a lake reflecting the scenery."
    },
    {
      challenge: "Futuristic City",
      target: "A gleaming metropolis with flying vehicles, holographic advertisements, and towering skyscrapers stretching into the clouds."
    }
  ];

  // This would be server-side in a real implementation
  const createGame = (type: GameType, playerCount: PlayerNumber) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const challenge = type === 'text' ? 
      textChallenges[Math.floor(Math.random() * textChallenges.length)] : 
      imageChallenges[Math.floor(Math.random() * imageChallenges.length)];
    
    const players = Array.from({ length: playerCount }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`
    }));

    setGameState({
      gameId,
      players,
      currentPlayerIndex: 0,
      gameType: type,
      challenge: challenge.challenge,
      target: challenge.target,
      prompts: [],
      currentRound: 1,
      totalRounds: 3,
      gameOver: false,
      score: 0
    });

    return gameId;
  };

  // Mock join game function
  const joinGame = async (gameId: string): Promise<boolean> => {
    // In a real app, this would verify the game ID with a server
    if (gameId.length === 6) {
      return true;
    }
    return false;
  };

  // Simulate AI evaluation of prompts
  const evaluatePrompt = (prompt: string, target: string): { success: boolean, response: string } => {
    // This is a simple simulation - in a real app, this would call an AI API
    const words = prompt.split(' ').length;
    const targetWords = target.split(' ').length;
    
    // If the prompt is too short, it fails
    if (words < 5) {
      return {
        success: false,
        response: target.slice(0, 50) + "..."
      };
    }
    
    // If this is not the first prompt and it's reasonably complex, success is more likely
    const success = Math.random() > 0.4;
    
    return {
      success,
      response: success ? target : target.slice(0, Math.floor(target.length * 0.7)) + "..."
    };
  };

  const submitPrompt = async (promptText: string): Promise<boolean> => {
    if (!gameState) return false;
    
    const evaluation = evaluatePrompt(promptText, gameState.target);
    
    const newPrompt: Prompt = {
      text: promptText,
      player: gameState.players[gameState.currentPlayerIndex].id,
      aiResponse: evaluation.response,
      success: evaluation.success
    };
    
    const updatedPrompts = [...gameState.prompts, newPrompt];
    
    // If successful, prepare for next round
    if (evaluation.success) {
      setGameState({
        ...gameState,
        prompts: updatedPrompts,
        score: gameState.score + 10,
        gameOver: gameState.currentRound >= gameState.totalRounds,
      });
      return true;
    }
    
    // Move to next player
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    setGameState({
      ...gameState,
      prompts: updatedPrompts,
      currentPlayerIndex: nextPlayerIndex,
    });
    
    return false;
  };

  const startNewRound = () => {
    if (!gameState) return;
    
    const newChallenge = gameState.gameType === 'text' ? 
      textChallenges[Math.floor(Math.random() * textChallenges.length)] : 
      imageChallenges[Math.floor(Math.random() * imageChallenges.length)];
    
    setGameState({
      ...gameState,
      challenge: newChallenge.challenge,
      target: newChallenge.target,
      prompts: [],
      currentRound: gameState.currentRound + 1,
      currentPlayerIndex: Math.floor(Math.random() * gameState.players.length), // Random player starts
    });
  };

  const resetGame = () => {
    setGameState(null);
    setSelectedGameType(null);
  };

  return (
    <GameContext.Provider 
      value={{ 
        gameState, 
        setGameState, 
        playerCount, 
        setPlayerCount, 
        selectedGameType, 
        setSelectedGameType,
        createGame,
        joinGame,
        submitPrompt,
        startNewRound,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
