import { useState, useCallback } from 'react';
import type { MLCEngineInterface } from '@mlc-ai/web-llm';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface UseChatOptions {
  defaultOptions?: ChatOptions;
  onError?: (error: string) => void;
}

interface UseChatReturn {
  messages: Message[];
  isGenerating: boolean;
  sendMessage: (content: string, streaming?: boolean) => Promise<void>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setSystemMessage: (content: string) => void;
}

export const useChat = (engine: MLCEngineInterface | null, options: UseChatOptions = {}): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const defaultChatOptions: ChatOptions = {
    temperature: 0.7,
    max_tokens: 500,
    top_p: 0.9,
    ...options.defaultOptions,
  };

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setSystemMessage = useCallback((content: string) => {
    const systemMessage: Message = {
      role: 'system',
      content,
    };
    setMessages([systemMessage]);
  }, []);

  const sendMessage = useCallback(
    async (content: string, streaming: boolean = true) => {
      if (!engine || !content.trim() || isGenerating) return;

      const userMessage: Message = {
        role: 'user',
        content: content.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsGenerating(true);

      try {
        // Get chat messages (excluding system messages for the API call)
        const chatMessages = messages.filter((msg) => msg.role !== 'system').concat([userMessage]);

        if (streaming) {
          // Streaming response
          const assistantMessage: Message = {
            role: 'assistant',
            content: '',
          };

          setMessages((prev) => [...prev, assistantMessage]);

          const chunks = await engine.chat.completions.create({
            messages: chatMessages,
            ...defaultChatOptions,
            stream: true,
            stream_options: { include_usage: true },
          });

          let fullContent = '';
          for await (const chunk of chunks) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullContent += content;

            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: fullContent,
              };
              return newMessages;
            });

            if (chunk.usage) {
              console.log('Usage:', chunk.usage);
            }
          }
        } else {
          // Non-streaming response
          const response = await engine.chat.completions.create({
            messages: chatMessages,
            ...defaultChatOptions,
            stream: false,
          });

          const assistantMessage: Message = {
            role: 'assistant',
            content: response.choices[0].message.content || 'No response generated.',
          };

          setMessages((prev) => [...prev, assistantMessage]);
          console.log('Usage:', response.usage);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate response';
        options.onError?.(errorMessage);
        console.error('Failed to send message:', err);
      } finally {
        setIsGenerating(false);
      }
    },
    [engine, isGenerating, messages, defaultChatOptions, options],
  );

  return {
    messages,
    isGenerating,
    sendMessage,
    addMessage,
    clearMessages,
    setSystemMessage,
  };
};
