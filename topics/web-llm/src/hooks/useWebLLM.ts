import { useState, useCallback } from 'react';
import { CreateMLCEngine, type MLCEngineInterface } from '@mlc-ai/web-llm';

interface UseWebLLMOptions {
  onProgress?: (progress: string) => void;
  onError?: (error: string) => void;
}

interface UseWebLLMReturn {
  engine: MLCEngineInterface | null;
  isLoading: boolean;
  loadingProgress: string;
  error: string | null;
  loadModel: (modelId: string) => Promise<void>;
  unloadModel: () => Promise<void>;
  isModelLoaded: boolean;
}

export const useWebLLM = (options: UseWebLLMOptions = {}): UseWebLLMReturn => {
  const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadModel = useCallback(
    async (modelId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadingProgress('Initializing engine...');

        // Clear existing engine if any
        if (engine) {
          await engine.unload();
          setEngine(null);
        }

        const newEngine = await CreateMLCEngine(modelId, {
          initProgressCallback: (progress) => {
            const progressText = progress.text || 'Loading...';
            setLoadingProgress(progressText);
            options.onProgress?.(progressText);
          },
        });

        setEngine(newEngine);
        setLoadingProgress('Model loaded successfully!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load model';
        setError(errorMessage);
        options.onError?.(errorMessage);
        console.error('Failed to initialize engine:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [engine, options],
  );

  const unloadModel = useCallback(async () => {
    if (engine) {
      try {
        await engine.unload();
        setEngine(null);
        setError(null);
        setLoadingProgress('');
      } catch (err) {
        console.error('Failed to unload engine:', err);
      }
    }
  }, [engine]);

  return {
    engine,
    isLoading,
    loadingProgress,
    error,
    loadModel,
    unloadModel,
    isModelLoaded: !!engine,
  };
};
