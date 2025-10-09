# Web-LLM React Example with Gemma 2

This project demonstrates how to use Google's Gemma 2 models in a React application using [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm). The models run entirely in the browser using WebGPU for hardware acceleration.

## Features

- ✅ **Local AI**: Models run entirely in your browser - no data sent to servers
- ✅ **Gemma 2 Support**: Support for Gemma 2 2B and 9B models
- ✅ **Streaming Responses**: Real-time streaming chat responses
- ✅ **React Hooks**: Clean, reusable hooks for Web-LLM integration
- ✅ **TypeScript**: Full TypeScript support with proper types
- ✅ **Tailwind CSS**: Modern, responsive UI design
- ✅ **Component Architecture**: Modular, reusable React components

## Quick Start

### Prerequisites

- **WebGPU Support**: Your browser must support WebGPU
  - Chrome 113+, Edge 113+, or Firefox with WebGPU enabled
  - **GPU Requirements**: 4GB+ VRAM recommended (8GB+ for Gemma 2 9B)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Select Model**: Choose between Gemma 2 2B (faster) or 9B (better quality)
2. **Load Model**: Click "Load Model" to download and initialize (may take a few minutes first time)
3. **Start Chatting**: Once loaded, start a conversation with the AI
4. **Toggle Streaming**: Enable/disable real-time streaming responses

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ChatMessage.tsx   # Individual chat message component
│   ├── ChatInput.tsx     # Message input with send button
│   ├── LoadingSpinner.tsx # Loading indicator
│   ├── TypingIndicator.tsx # "AI is typing" animation
│   ├── ModelSelector.tsx  # Model selection dropdown
│   └── ErrorDisplay.tsx   # Error message display
├── hooks/               # Custom React hooks
│   ├── useWebLLM.ts     # Web-LLM engine management
│   └── useChat.ts       # Chat state and message handling
├── config/              # Configuration and utilities
│   └── models.ts        # Model configs and advanced examples
└── App.tsx              # Main application component
```

## Available Models

| Model      | Size | VRAM  | Speed  | Quality | Description                 |
| ---------- | ---- | ----- | ------ | ------- | --------------------------- |
| Gemma 2 2B | 2B   | 2-4GB | Fast   | Good    | Lightweight, fast responses |
| Gemma 2 9B | 9B   | 6-8GB | Medium | Better  | Balanced performance        |

## API Examples

### Basic Chat Completion

```typescript
import { CreateMLCEngine } from '@mlc-ai/web-llm';

// Initialize engine
const engine = await CreateMLCEngine('gemma-2-2b-it-q4f16_1-MLC');

// Send a message
const response = await engine.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello! How are you?' }],
  temperature: 0.7,
  max_tokens: 500,
});

console.log(response.choices[0].message.content);
```

### Streaming Responses

```typescript
// Enable streaming
const chunks = await engine.chat.completions.create({
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true,
  stream_options: { include_usage: true },
});

// Process chunks in real-time
let fullResponse = '';
for await (const chunk of chunks) {
  const content = chunk.choices[0]?.delta?.content || '';
  fullResponse += content;
  console.log(content); // Display as it comes
}
```

### Using Custom Hooks

```typescript
import { useWebLLM } from './hooks/useWebLLM';
import { useChat } from './hooks/useChat';

function MyComponent() {
  // Engine management
  const { engine, isLoading, loadModel } = useWebLLM();

  // Chat functionality
  const { messages, sendMessage, isGenerating } = useChat(engine);

  return (
    <div>
      <button onClick={() => loadModel('gemma-2-2b-it-q4f16_1-MLC')}>Load Model</button>
      {/* Chat UI */}
    </div>
  );
}
```

## Advanced Configuration

### Custom Chat Options

```typescript
// Different presets for various use cases
const CHAT_PRESETS = {
  creative: {
    temperature: 0.9,
    top_p: 0.95,
    max_tokens: 1000,
  },
  precise: {
    temperature: 0.3,
    top_p: 0.7,
    max_tokens: 300,
  },
  coding: {
    temperature: 0.1,
    top_p: 0.5,
    max_tokens: 2000,
  },
};
```

### Custom System Prompts

```typescript
const systemPrompts = {
  assistant: 'You are a helpful AI assistant.',
  coding: 'You are an expert programming assistant.',
  creative: 'You are a creative writing assistant.',
};
```

## Performance Tips

1. **Model Selection**:

   - Use Gemma 2 2B for faster responses
   - Use Gemma 2 9B for better quality (requires more VRAM)

2. **Memory Management**:

   - Models are cached in browser storage after first download
   - Clear browser data to free up space if needed

3. **GPU Requirements**:
   - Minimum 4GB VRAM for Gemma 2 2B
   - Recommended 8GB+ VRAM for Gemma 2 9B

## Browser Compatibility

| Browser     | WebGPU Support   | Status          |
| ----------- | ---------------- | --------------- |
| Chrome 113+ | ✅ Native        | Fully Supported |
| Edge 113+   | ✅ Native        | Fully Supported |
| Firefox     | ⚠️ Flag Required | Experimental    |
| Safari      | ❌ Not Yet       | Coming Soon     |

## Troubleshooting

### Common Issues

1. **"WebGPU not supported"**

   - Update browser to latest version
   - Enable WebGPU in browser flags if needed

2. **Model loading fails**

   - Check VRAM availability
   - Try smaller model (2B instead of 9B)
   - Clear browser cache and retry

3. **Slow performance**
   - Ensure hardware acceleration is enabled
   - Close other GPU-intensive applications
   - Try reducing max_tokens

### WebGPU Browser Flags

For Firefox, enable:

- `dom.webgpu.enabled` = true
- `gfx.webgpu.force-enabled` = true

## Resources

- [WebLLM Documentation](https://mlc.ai/docs/)
- [Gemma Models](https://huggingface.co/google/gemma-2-2b-it)
- [WebGPU Support](https://caniuse.com/webgpu)
- [MLC-AI GitHub](https://github.com/mlc-ai/web-llm)

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
