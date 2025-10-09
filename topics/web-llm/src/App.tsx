import { type FC, useState, useRef, useEffect } from 'react';
import { useWebLLM } from './hooks/useWebLLM';
import { useChat } from './hooks/useChat';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TypingIndicator } from './components/TypingIndicator';
import { ModelSelector } from './components/ModelSelector';
import { ErrorDisplay } from './components/ErrorDisplay';

interface ModelConfig {
  id: string;
  name: string;
  description: string;
}

const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'gemma-2-2b-it-q4f16_1-MLC',
    name: 'Gemma 2 2B',
    description: 'Google Gemma 2 2B Instruct - Fast and efficient',
  },
  {
    id: 'gemma-2-9b-it-q4f16_1-MLC',
    name: 'Gemma 2 9B',
    description: 'Google Gemma 2 9B Instruct - More capable, requires more memory',
  },
];

export const App: FC = () => {
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [isStreaming, setIsStreaming] = useState(true);
  const [chatError, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    engine,
    isLoading,
    loadingProgress,
    error: engineError,
    loadModel,
    isModelLoaded,
  } = useWebLLM({
    onError: (error) => console.error('Engine error:', error),
  });

  const { messages, isGenerating, sendMessage, clearMessages, setSystemMessage } = useChat(engine, {
    onError: setChatError,
    defaultOptions: {
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isModelLoaded) {
      setSystemMessage('You are a helpful AI assistant powered by Google Gemma 2. How can I help you today?');
    }
  }, [isModelLoaded, setSystemMessage]);

  const handleLoadModel = async () => {
    await loadModel(selectedModel);
  };

  const handleSendMessage = async (content: string) => {
    setChatError(null);
    await sendMessage(content, isStreaming);
  };

  const handleClearChat = () => {
    clearMessages();
    if (isModelLoaded) {
      setSystemMessage('You are a helpful AI assistant powered by Google Gemma 2. How can I help you today?');
    }
  };

  const currentError = engineError || chatError;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-900">Web-LLM Chat with Gemma 2</h1>
          <p className="text-sm text-gray-600 mt-1">
            AI chat powered by Google Gemma 2 running locally in your browser
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {/* Model Selection and Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <ModelSelector
              models={AVAILABLE_MODELS}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
              disabled={isLoading || isModelLoaded}
            />

            <div className="flex gap-2">
              <button
                onClick={handleLoadModel}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {isLoading && <LoadingSpinner size="sm" />}
                {isLoading ? 'Loading...' : isModelLoaded ? 'Reload Model' : 'Load Model'}
              </button>

              {isModelLoaded && (
                <button
                  onClick={handleClearChat}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 font-medium"
                >
                  Clear Chat
                </button>
              )}
            </div>
          </div>

          {/* Streaming toggle */}
          {isModelLoaded && (
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="streaming"
                checked={isStreaming}
                onChange={(e) => setIsStreaming(e.target.checked)}
                disabled={isGenerating}
                className="rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="streaming" className="text-sm text-gray-700">
                Enable streaming responses
              </label>
            </div>
          )}
        </div>

        {/* Loading Progress */}
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <LoadingSpinner size="sm" />
              <span className="text-blue-800">{loadingProgress}</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {currentError && (
          <ErrorDisplay
            error={currentError}
            onDismiss={() => {
              setChatError(null);
              // Note: Engine errors are handled by the hook and reset automatically
            }}
          />
        )}

        {/* Chat Messages */}
        {isModelLoaded && (
          <div className="bg-white rounded-lg shadow-sm border mb-6 flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} index={index} />
              ))}
              {isGenerating && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={handleSendMessage} disabled={isGenerating} placeholder="Type your message..." />
          </div>
        )}

        {/* Instructions */}
        {!isModelLoaded && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                This demo runs Google Gemma 2 models directly in your browser using WebLLM. No data is sent to external
                servers - everything runs locally!
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Select a Gemma 2 model above (2B is faster, 9B is more capable)</li>
                <li>Click "Load Model" to download and initialize the model</li>
                <li>Start chatting once the model is loaded</li>
                <li>Toggle streaming to see responses generated word-by-word</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                <p className="text-yellow-800 text-xs">
                  <strong>Note:</strong> First-time model loading may take several minutes as the model files are
                  downloaded and cached in your browser. Gemma 2 9B requires significant GPU memory (8GB+ recommended).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
