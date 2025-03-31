
import React from 'react';
import { Prompt } from '@/contexts/GameContext';

interface PromptHistoryProps {
  prompts: Prompt[];
  showPlayer?: boolean;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ prompts, showPlayer = true }) => {
  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Prompt History</h3>
      <div className="space-y-3">
        {prompts.map((prompt, index) => (
          <div key={index} className="game-card">
            {showPlayer && (
              <div className="text-sm text-gray-400 mb-1">
                Player {prompt.player} prompted:
              </div>
            )}
            <div className="prompt-font text-sm">
              {prompt.text}
            </div>
            {prompt.aiResponse && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-1">AI response:</div>
                <div className="prompt-font text-sm">
                  {prompt.aiResponse}
                </div>
              </div>
            )}
            {prompt.success !== undefined && (
              <div className={`mt-2 text-sm ${prompt.success ? 'success-text' : 'error-text'}`}>
                {prompt.success ? 'Success!' : 'Try again'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptHistory;
