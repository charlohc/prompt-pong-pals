
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";

// Pages
import Index from "./pages/Index";
import PlayerSelection from "./pages/PlayerSelection";
import GameSelection from "./pages/GameSelection";
import GameDescription from "./pages/GameDescription";
import GameRoom from "./pages/GameRoom";
import PostGameChat from "./pages/PostGameChat";
import JoinGame from "./pages/JoinGame";
import TeamSetup from "./pages/TeamSetup";
import ViewRankings from "./pages/ViewRankings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/player-selection" element={<PlayerSelection />} />
            <Route path="/game-selection" element={<GameSelection />} />
            <Route path="/game-description" element={<GameDescription />} />
            <Route path="/game-room" element={<GameRoom />} />
            <Route path="/post-game-chat" element={<PostGameChat />} />
            <Route path="/join" element={<JoinGame />} />
            <Route path="/team-setup" element={<TeamSetup />} />
            <Route path="/view-rankings" element={<ViewRankings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
