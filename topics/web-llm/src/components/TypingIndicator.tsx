import { type FC } from 'react';

interface TypingIndicatorProps {
  message?: string;
}

export const TypingIndicator: FC<TypingIndicatorProps> = ({ message = 'AI is thinking...' }) => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm">{message}</span>
        </div>
      </div>
    </div>
  );
};
