
import React from 'react';
import { Lightbulb, MessageSquare, Check, X } from 'lucide-react';

interface TeamFeedbackProps {
  success: boolean;
  prompts: Array<{ text: string, success?: boolean }>;
  challenge: string;
}

const TeamFeedback: React.FC<TeamFeedbackProps> = ({ success, prompts, challenge }) => {
  // Generate AI feedback based on the prompts
  const generateFeedback = () => {
    if (prompts.length === 0) return [];
    
    if (prompts.length === 1) {
      return success ? [
        "Great job solving this on the first try!",
        "Your prompt was concise and captured the key elements."
      ] : [
        "Good first attempt, but you missed some key elements.",
        "Try to be more specific about the visual details."
      ];
    }
    
    if (success) {
      return [
        `It took ${prompts.length} attempts, but you got there!`,
        "You improved by adding more specific descriptors.",
        "Your teamwork evolved the prompt effectively."
      ];
    } else {
      return [
        "Keep trying! You're getting closer.",
        "Focus on key visual elements in the target.",
        "Be more specific about the scene details."
      ];
    }
  };
  
  // Get tips based on the challenge type
  const getTips = () => {
    if (challenge.includes("Mountain") || challenge.includes("Landscape")) {
      return [
        "Describe specific geographical features",
        "Include details about lighting and atmosphere",
        "Mention colors with specific shades"
      ];
    }
    
    if (challenge.includes("Haunted") || challenge.includes("House")) {
      return [
        "Use eerie and specific descriptors",
        "Include sensory details beyond just visuals",
        "Create atmosphere with carefully chosen adjectives"
      ];
    }
    
    // Default tips
    return [
      "Be specific about key visual elements",
      "Include composition details",
      "Use vivid and precise descriptors"
    ];
  };
  
  const feedback = generateFeedback();
  const tips = getTips();
  
  return (
    <div className="space-y-4">
      <div className={`game-card ${success ? 'border-game-success' : 'border-game-accent'}`}>
        <h3 className="font-semibold mb-3 flex items-center">
          <MessageSquare size={16} className="mr-2 text-game-accent" />
          AI Feedback
        </h3>
        
        <div className="space-y-2">
          {feedback.map((item, index) => (
            <p key={index} className="text-gray-200">{item}</p>
          ))}
        </div>
      </div>
      
      <div className="game-card">
        <h3 className="font-semibold mb-3 flex items-center">
          <Lightbulb size={16} className="mr-2 text-yellow-400" />
          Tips for Next Round
        </h3>
        
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span className="text-gray-200">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="game-card">
        <h3 className="font-semibold mb-3">Prompt Evolution</h3>
        
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
          {prompts.map((prompt, index) => (
            <div key={index} className="text-sm bg-gray-700/50 p-2 rounded-md">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Attempt {index + 1}</span>
                {prompt.success !== undefined && (
                  prompt.success ? 
                    <Check size={16} className="text-green-400" /> : 
                    <X size={16} className="text-red-400" />
                )}
              </div>
              <p className="text-white">{prompt.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamFeedback;
