
export interface ModelPricing {
  id: string;
  name: string;
  inputPrice: number;  // Cost per 1K input tokens in USD
  outputPrice: number; // Cost per 1K output tokens in USD
}

export const modelOptions: ModelPricing[] = [
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    inputPrice: 0.01,    // $0.01 per 1K tokens
    outputPrice: 0.03,   // $0.03 per 1K tokens
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    inputPrice: 0.0005,  // $0.0005 per 1K tokens
    outputPrice: 0.0015, // $0.0015 per 1K tokens
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    inputPrice: 0.015,   // $0.015 per 1K tokens
    outputPrice: 0.075,  // $0.075 per 1K tokens
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    inputPrice: 0.003,   // $0.003 per 1K tokens
    outputPrice: 0.015,  // $0.015 per 1K tokens
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    inputPrice: 0.0002,  // $0.0002 per 1K tokens
    outputPrice: 0.0002, // $0.0002 per 1K tokens
  }
];

export interface ContextWindowOption {
  id: string;
  name: string;
  tokens: number;
}

export const contextWindowOptions: ContextWindowOption[] = [
  { id: "4k", name: "4K", tokens: 4000 },
  { id: "8k", name: "8K", tokens: 8000 },
  { id: "16k", name: "16K", tokens: 16000 },
  { id: "32k", name: "32K", tokens: 32000 },
  { id: "128k", name: "128K", tokens: 128000 },
];
