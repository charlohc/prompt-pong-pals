
import React from 'react';

interface AIResponseProps {
  response: string;
  success?: boolean;
  feedbackMessage?: string;
}

const AIResponse: React.FC<AIResponseProps> = ({ 
  response, 
  success, 
  feedbackMessage 
}) => {
  return (
    <div className="space-y-4">
      <div className="game-card prompt-font text-left min-h-24">
        {response}
      </div>
      
      {success !== undefined && (
        <div className={`game-card ${success ? 'border-game-success' : 'border-game-error'}`}>
          <p className={success ? 'success-text' : 'error-text'}>
            {success 
              ? 'Your prompt generated a close enough text!' 
              : 'Your prompt did not generate a close enough text'
            }
          </p>
          <p className="text-gray-300 mt-2">
            {feedbackMessage || (success 
              ? 'Congratulations!' 
              : 'Try to be more precise and mention the important elements'
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIResponse;
