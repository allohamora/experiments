import { type FC } from 'react';

interface ModelConfig {
  id: string;
  name: string;
  description: string;
}

interface ModelSelectorProps {
  models: ModelConfig[];
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  disabled?: boolean;
}

export const ModelSelector: FC<ModelSelectorProps> = ({ models, selectedModel, onModelSelect, disabled = false }) => {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Model:</label>
      <select
        value={selectedModel}
        onChange={(e) => onModelSelect(e.target.value)}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.description}
          </option>
        ))}
      </select>
    </div>
  );
};
