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
  isMuted: boolean;
}

export interface Team {
  id: number;
  name: string;
  players: Player[];
  currentPlayerIndex: number;
  score: number;
  prompts: Prompt[];
}

export interface GameState {
  gameId: string;
  gamePin: string;
  teams: Team[];
  currentTeamIndex: number;
  gameType: GameType;
  challenge: string;
  target: string;
  currentRound: number;
  totalRounds: number;
  gameOver: boolean;
  gameStarted: boolean;
}

interface GameContextType {
  gameState: GameState | null;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  playerCount: PlayerNumber;
  setPlayerCount: React.Dispatch<React.SetStateAction<PlayerNumber>>;
  selectedGameType: GameType | null;
  setSelectedGameType: React.Dispatch<React.SetStateAction<GameType | null>>;
  createGame: (type: GameType, playerCount: PlayerNumber) => void;
  joinGame: (gamePin: string) => Promise<boolean>;
  submitPrompt: (prompt: string) => Promise<boolean>;
  startNewRound: () => void;
  resetGame: () => void;
  currentPlayer: Player | null;
  currentTeam: Team | null;
  isCurrentPlayerActive: boolean;
  toggleMute: (playerId: number, teamId: number) => void;
  setTeamName: (teamId: number, name: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerCount, setPlayerCount] = useState<PlayerNumber>(4);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(1);
  const [currentTeamId, setCurrentTeamId] = useState<number>(1);

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

  // Generate a random pin
  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Create mock teams with players
  const createMockTeams = (playerCount: PlayerNumber) => {
    const totalTeams = 3; // Including the user's team
    const teams: Team[] = [];
    
    // User's team (Team 1)
    const userTeam: Team = {
      id: 1,
      name: "Team 1",
      players: Array.from({ length: playerCount }, (_, i) => ({
        id: i + 1,
        name: i === 0 ? "You" : `Teammate ${i + 1}`,
        isMuted: false
      })),
      currentPlayerIndex: 0,
      score: 0,
      prompts: []
    };
    teams.push(userTeam);
    
    // Other mock teams
    for (let t = 2; t <= totalTeams; t++) {
      teams.push({
        id: t,
        name: `Team ${t}`,
        players: Array.from({ length: playerCount }, (_, i) => ({
          id: t * 10 + i + 1,
          name: `Team ${t} Player ${i + 1}`,
          isMuted: Math.random() > 0.7
        })),
        currentPlayerIndex: 0,
        score: Math.floor(Math.random() * 50),
        prompts: []
      });
    }
    
    return teams;
  };

  // This would be server-side in a real implementation
  const createGame = (type: GameType, playerCount: PlayerNumber) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const gamePin = generatePin();
    const challenge = type === 'text' ? 
      textChallenges[Math.floor(Math.random() * textChallenges.length)] : 
      imageChallenges[Math.floor(Math.random() * imageChallenges.length)];
    
    const teams = createMockTeams(playerCount);
    
    setGameState({
      gameId,
      gamePin,
      teams,
      currentTeamIndex: 0, // User's team goes first
      gameType: type,
      challenge: challenge.challenge,
      target: challenge.target,
      currentRound: 1,
      totalRounds: 3,
      gameOver: false,
      gameStarted: false
    });
    
    // Set the current player as first player of first team
    setCurrentPlayerId(1);
    setCurrentTeamId(1);

    return gameId;
  };

  // Mock join game function
  const joinGame = async (pin: string): Promise<boolean> => {
    // In a real app, this would verify the game PIN with a server
    // For demo, accept specific pins
    if (pin === "123456" || pin === gameState?.gamePin) {
      if (!gameState) {
        // Create a new game if joining with test PIN
        const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const challenge = textChallenges[Math.floor(Math.random() * textChallenges.length)];
        const teams = createMockTeams(playerCount);
        
        setGameState({
          gameId,
          gamePin: pin,
          teams,
          currentTeamIndex: 0,
          gameType: 'text',
          challenge: challenge.challenge,
          target: challenge.target,
          currentRound: 1,
          totalRounds: 3,
          gameOver: false,
          gameStarted: false
        });
        
        setCurrentPlayerId(1);
        setCurrentTeamId(1);
      }
      return true;
    }
    return false;
  };

  // Get current team and player
  const currentTeam = gameState ? 
    gameState.teams.find(team => team.id === currentTeamId) || null : 
    null;
    
  const currentPlayer = currentTeam ? 
    currentTeam.players.find(player => player.id === currentPlayerId) || null : 
    null;
    
  const isCurrentPlayerActive = currentTeam ? 
    currentTeam.currentPlayerIndex === currentTeam.players.findIndex(p => p.id === currentPlayerId) : 
    false;

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
    if (!gameState || !currentTeam) return false;
    
    const evaluation = evaluatePrompt(promptText, gameState.target);
    
    const newPrompt: Prompt = {
      text: promptText,
      player: currentPlayerId,
      aiResponse: evaluation.response,
      success: evaluation.success
    };
    
    // Update team prompts
    const updatedTeams = gameState.teams.map(team => {
      if (team.id === currentTeamId) {
        return {
          ...team,
          prompts: [...team.prompts, newPrompt],
          score: evaluation.success ? team.score + 10 : team.score
        };
      }
      return team;
    });
    
    // If successful, prepare for next round or end game
    if (evaluation.success) {
      setGameState({
        ...gameState,
        teams: updatedTeams,
        gameOver: gameState.currentRound >= gameState.totalRounds,
      });
      return true;
    }
    
    // Move to next player in the team
    const updatedTeamIndex = updatedTeams.findIndex(team => team.id === currentTeamId);
    const nextPlayerIndex = (currentTeam.currentPlayerIndex + 1) % currentTeam.players.length;
    
    updatedTeams[updatedTeamIndex].currentPlayerIndex = nextPlayerIndex;
    
    setGameState({
      ...gameState,
      teams: updatedTeams,
    });
    
    return false;
  };

  const startNewRound = () => {
    if (!gameState) return;
    
    const newChallenge = gameState.gameType === 'text' ? 
      textChallenges[Math.floor(Math.random() * textChallenges.length)] : 
      imageChallenges[Math.floor(Math.random() * imageChallenges.length)];
    
    // Reset all teams for new round
    const updatedTeams = gameState.teams.map(team => ({
      ...team,
      prompts: [],
      currentPlayerIndex: Math.floor(Math.random() * team.players.length), // Random player starts
    }));
    
    setGameState({
      ...gameState,
      teams: updatedTeams,
      challenge: newChallenge.challenge,
      target: newChallenge.target,
      currentRound: gameState.currentRound + 1,
      currentTeamIndex: Math.floor(Math.random() * updatedTeams.length), // Random team starts
    });
  };

  const resetGame = () => {
    setGameState(null);
    setSelectedGameType(null);
    setCurrentPlayerId(1);
    setCurrentTeamId(1);
  };

  // Toggle mute status for a player
  const toggleMute = (playerId: number, teamId: number) => {
    if (!gameState) return;
    
    const updatedTeams = gameState.teams.map(team => {
      if (team.id === teamId) {
        const updatedPlayers = team.players.map(player => {
          if (player.id === playerId) {
            return {
              ...player,
              isMuted: !player.isMuted
            };
          }
          return player;
        });
        
        return {
          ...team,
          players: updatedPlayers
        };
      }
      return team;
    });
    
    setGameState({
      ...gameState,
      teams: updatedTeams
    });
  };

  // Set team name
  const setTeamName = (teamId: number, name: string) => {
    if (!gameState) return;
    
    const updatedTeams = gameState.teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          name
        };
      }
      return team;
    });
    
    setGameState({
      ...gameState,
      teams: updatedTeams
    });
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
        resetGame,
        currentPlayer,
        currentTeam,
        isCurrentPlayerActive,
        toggleMute,
        setTeamName
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
