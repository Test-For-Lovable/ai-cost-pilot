
export interface ModelPricing {
  id: string;
  name: string;
  description: string;
  inputPrice: number;  // Cost per 1K input tokens in USD
  outputPrice: number; // Cost per 1K output tokens in USD
}

export const modelOptions: ModelPricing[] = [
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Very accurate, moderate cost",
    inputPrice: 0.01,    // $0.01 per 1K tokens
    outputPrice: 0.03,   // $0.03 per 1K tokens
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast, affordable option",
    inputPrice: 0.0005,  // $0.0005 per 1K tokens
    outputPrice: 0.0015, // $0.0015 per 1K tokens
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    description: "Premium quality, highest cost",
    inputPrice: 0.015,   // $0.015 per 1K tokens
    outputPrice: 0.075,  // $0.075 per 1K tokens
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    description: "High quality, reasonable cost",
    inputPrice: 0.003,   // $0.003 per 1K tokens
    outputPrice: 0.015,  // $0.015 per 1K tokens
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    description: "Budget-friendly, good for simple tasks",
    inputPrice: 0.0002,  // $0.0002 per 1K tokens
    outputPrice: 0.0002, // $0.0002 per 1K tokens
  }
];

export interface ContextWindowOption {
  id: string;
  name: string;
  description: string;
  tokens: number;
}

export const contextWindowOptions: ContextWindowOption[] = [
  { id: "4k", name: "Small (4K)", description: "Good for short conversations", tokens: 4000 },
  { id: "8k", name: "Medium (8K)", description: "Standard for most apps", tokens: 8000 },
  { id: "16k", name: "Large (16K)", description: "For longer conversations", tokens: 16000 },
  { id: "32k", name: "Extra Large (32K)", description: "For complex tasks with context", tokens: 32000 },
  { id: "128k", name: "Maximum (128K)", description: "For specialized applications", tokens: 128000 },
];

export interface PresetOption {
  id: string;
  name: string;
  model: string;
  monthlyUsers: number;
  promptsPerUser: number;
  responseLength: number;
  inputLength: number;
  outputLength: number;
  contextWindow: string;
}

export const presetOptions: PresetOption[] = [
  {
    id: "chatbot",
    name: "Chatbot SaaS",
    model: "gpt-3.5-turbo",
    monthlyUsers: 1000,
    promptsPerUser: 30,
    responseLength: 300,
    inputLength: 100,
    outputLength: 300,
    contextWindow: "8k"
  },
  {
    id: "writing",
    name: "AI Writing App",
    model: "gpt-4-turbo",
    monthlyUsers: 500,
    promptsPerUser: 20,
    responseLength: 800,
    inputLength: 200,
    outputLength: 800,
    contextWindow: "16k"
  },
  {
    id: "support",
    name: "AI Support Bot",
    model: "claude-sonnet",
    monthlyUsers: 2000,
    promptsPerUser: 10,
    responseLength: 250,
    inputLength: 150,
    outputLength: 250,
    contextWindow: "4k"
  },
  {
    id: "custom",
    name: "Custom (Manual Entry)",
    model: "gpt-4-turbo",
    monthlyUsers: 100,
    promptsPerUser: 10,
    responseLength: 500,
    inputLength: 200,
    outputLength: 800,
    contextWindow: "8k"
  }
];
