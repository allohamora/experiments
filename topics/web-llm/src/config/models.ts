import type { MLCEngineInterface } from '@mlc-ai/web-llm';

// Example configurations for different Gemma 2 and Gemma 3 variants
export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  memoryRequirement: string;
  speedRating: 'Fast' | 'Medium' | 'Slow';
  qualityRating: 'Good' | 'Better' | 'Best';
}

export const GEMMA_MODELS: ModelConfig[] = [
  // Gemma 2 Models
  {
    id: 'gemma-2-2b-it-q4f16_1-MLC',
    name: 'Gemma 2 2B Instruct',
    description: 'Lightweight model optimized for speed',
    memoryRequirement: '2-4GB VRAM',
    speedRating: 'Fast',
    qualityRating: 'Good',
  },
  {
    id: 'gemma-2-9b-it-q4f16_1-MLC',
    name: 'Gemma 2 9B Instruct',
    description: 'Balanced model with good performance',
    memoryRequirement: '6-8GB VRAM',
    speedRating: 'Medium',
    qualityRating: 'Better',
  },
  {
    id: 'gemma-2-27b-it-q4f16_1-MLC',
    name: 'Gemma 2 27B Instruct',
    description: 'Large model with highest quality (if available)',
    memoryRequirement: '16GB+ VRAM',
    speedRating: 'Slow',
    qualityRating: 'Best',
  },
];

// Advanced chat options for different use cases
export const CHAT_PRESETS = {
  creative: {
    temperature: 0.9,
    top_p: 0.95,
    max_tokens: 1000,
    repetition_penalty: 1.1,
  },
  balanced: {
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 500,
    repetition_penalty: 1.05,
  },
  precise: {
    temperature: 0.3,
    top_p: 0.7,
    max_tokens: 300,
    repetition_penalty: 1.0,
  },
  coding: {
    temperature: 0.1,
    top_p: 0.5,
    max_tokens: 2000,
    repetition_penalty: 1.0,
  },
};

// System prompts for different use cases
export const SYSTEM_PROMPTS = {
  assistant:
    'You are a helpful AI assistant powered by Google Gemma. You provide accurate, helpful, and thoughtful responses.',
  coding:
    'You are an expert programming assistant. You help write clean, efficient code and explain programming concepts clearly.',
  creative:
    'You are a creative writing assistant. You help with storytelling, creative writing, and imaginative content.',
  academic:
    'You are an academic research assistant. You provide scholarly, well-researched responses with careful reasoning.',
  casual: 'You are a friendly conversational AI. You chat in a casual, approachable manner while being helpful.',
};

// Example function to demonstrate advanced WebLLM usage
export async function demonstrateAdvancedFeatures(engine: MLCEngineInterface) {
  console.log('=== WebLLM Advanced Features Demo ===');

  // 1. Get GPU information
  try {
    const gpuVendor = await engine.getGPUVendor();
    console.log('GPU Vendor:', gpuVendor);

    const maxBufferSize = await engine.getMaxStorageBufferBindingSize();
    console.log('Max Storage Buffer Size:', maxBufferSize, 'bytes');
  } catch (error) {
    console.log('GPU info not available:', error);
  }

  // 2. Demonstrate different chat configurations
  const messages = [{ role: 'user' as const, content: 'Write a short poem about AI' }];

  // Creative response
  console.log('--- Creative Response ---');
  const creativeResponse = await engine.chat.completions.create({
    messages,
    ...CHAT_PRESETS.creative,
    stream: false,
  });
  console.log('Creative:', creativeResponse.choices[0].message.content);

  // Precise response
  console.log('--- Precise Response ---');
  const preciseResponse = await engine.chat.completions.create({
    messages,
    ...CHAT_PRESETS.precise,
    stream: false,
  });
  console.log('Precise:', preciseResponse.choices[0].message.content);

  // 3. Demonstrate streaming with custom stop tokens
  console.log('--- Streaming with Stop Tokens ---');
  const streamChunks = await engine.chat.completions.create({
    messages: [{ role: 'user' as const, content: 'Count from 1 to 10' }],
    temperature: 0.1,
    max_tokens: 100,
    stop: ['5', 'five'],
    stream: true,
  });

  let streamedText = '';
  for await (const chunk of streamChunks) {
    const content = chunk.choices[0]?.delta?.content || '';
    streamedText += content;
    console.log(content); // Real-time output to console
  }
  console.log('\nFinal streamed text:', streamedText);
}

// Utility function to check WebGPU support
export function checkWebGPUSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if WebGPU is available (with proper typing)
    const gpu = (navigator as any).gpu;
    if (!gpu) {
      console.warn('WebGPU not supported in this browser');
      resolve(false);
      return;
    }

    gpu
      .requestAdapter()
      .then((adapter: any) => {
        if (adapter) {
          console.log('WebGPU adapter found:', adapter);
          resolve(true);
        } else {
          console.warn('No WebGPU adapter available');
          resolve(false);
        }
      })
      .catch((error: any) => {
        console.error('WebGPU adapter request failed:', error);
        resolve(false);
      });
  });
}

// Performance monitoring utility
export class PerformanceMonitor {
  private startTime: number = 0;
  private tokenCount: number = 0;

  startTiming() {
    this.startTime = performance.now();
    this.tokenCount = 0;
  }

  updateTokenCount(tokens: number) {
    this.tokenCount = tokens;
  }

  getStats() {
    const duration = performance.now() - this.startTime;
    const tokensPerSecond = this.tokenCount / (duration / 1000);

    return {
      duration: Math.round(duration),
      tokenCount: this.tokenCount,
      tokensPerSecond: Math.round(tokensPerSecond * 100) / 100,
    };
  }
}
