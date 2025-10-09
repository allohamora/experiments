import { type FC } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatMessageProps {
  message: Message;
  index: number;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  if (message.role === 'system') {
    return (
      <div className="w-full">
        <div className="bg-gray-100 text-gray-800 border-l-4 border-gray-400 px-4 py-2 rounded-lg text-center">
          <div className="font-medium text-sm">{message.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
};
