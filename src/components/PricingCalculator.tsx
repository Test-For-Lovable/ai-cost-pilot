
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import InfoTooltip from './InfoTooltip';
import { modelOptions, contextWindowOptions, ModelPricing } from '@/data/modelData';
import { Calculator } from 'lucide-react';

const PricingCalculator: React.FC = () => {
  // Form state
  const [selectedModel, setSelectedModel] = useState<ModelPricing>(modelOptions[0]);
  const [monthlyUsers, setMonthlyUsers] = useState<number>(100);
  const [promptsPerUser, setPromptsPerUser] = useState<number>(10);
  const [inputTokensPerPrompt, setInputTokensPerPrompt] = useState<number>(200);
  const [outputTokensPerPrompt, setOutputTokensPerPrompt] = useState<number>(800);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [contextWindow, setContextWindow] = useState<string>("8k");
  
  // Results state
  const [totalTokensPerMonth, setTotalTokensPerMonth] = useState<number>(0);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  const [costPerUser, setCostPerUser] = useState<number>(0);
  const [minimumPrice, setMinimumPrice] = useState<number>(0);
  const [suggestedStrategy, setSuggestedStrategy] = useState<string>("");
  
  // Calculate results whenever inputs change
  useEffect(() => {
    if (!selectedModel) return;
    
    const inputTotal = monthlyUsers * promptsPerUser * inputTokensPerPrompt;
    const outputTotal = monthlyUsers * promptsPerUser * outputTokensPerPrompt;
    const totalTokens = inputTotal + outputTotal;
    
    const inputCost = (inputTotal / 1000) * selectedModel.inputPrice;
    const outputCost = (outputTotal / 1000) * selectedModel.outputPrice;
    const totalCost = inputCost + outputCost;
    
    const userCost = totalCost / monthlyUsers;
    
    // Suggested minimum price with 40% margin
    const suggestedPrice = userCost * 1.4;
    
    setTotalTokensPerMonth(totalTokens);
    setMonthlyCost(totalCost);
    setCostPerUser(userCost);
    setMinimumPrice(suggestedPrice);
    
    // Determine pricing strategy based on usage pattern
    if (promptsPerUser < 5) {
      setSuggestedStrategy("Flat Rate");
    } else if (promptsPerUser >= 5 && promptsPerUser < 20) {
      setSuggestedStrategy("Tiered Pricing");
    } else {
      setSuggestedStrategy("Usage-based Pricing");
    }
    
  }, [selectedModel, monthlyUsers, promptsPerUser, inputTokensPerPrompt, outputTokensPerPrompt]);
  
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Input Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-theme-blue-500" />
            <span>AI Cost Calculator</span>
          </CardTitle>
          <CardDescription>
            Enter your usage estimates to calculate costs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="model">
              Which AI model are you using?
              <InfoTooltip content="Different models have different pricing structures and capabilities. Select the one you're currently using or planning to use." />
            </Label>
            <Select
              value={selectedModel.id}
              onValueChange={(value) => {
                const model = modelOptions.find(m => m.id === value);
                if (model) setSelectedModel(model);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((model) => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedModel.name} pricing: ${selectedModel.inputPrice.toFixed(4)} per 1K input tokens, ${selectedModel.outputPrice.toFixed(4)} per 1K output tokens
            </p>
          </div>
          
          {/* Monthly Users */}
          <div className="space-y-2">
            <Label htmlFor="users">
              Monthly Active Users
              <InfoTooltip content="The number of unique users who will interact with your AI features each month." />
            </Label>
            <Input
              id="users"
              type="number"
              min="1"
              value={monthlyUsers}
              onChange={(e) => setMonthlyUsers(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full"
            />
          </div>
          
          {/* Prompts Per User */}
          <div className="space-y-2">
            <Label htmlFor="prompts">
              Average Prompts Per User/Month
              <InfoTooltip content="How many times each user will interact with the AI model in a month." />
            </Label>
            <Input
              id="prompts"
              type="number"
              min="1"
              value={promptsPerUser}
              onChange={(e) => setPromptsPerUser(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full"
            />
          </div>
          
          {/* Tokens Per Prompt */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input-tokens">
                Input Tokens/Prompt
                <InfoTooltip content="Average number of tokens in the user's input messages. A token is roughly 4 characters or 3/4 of a word." />
              </Label>
              <Input
                id="input-tokens"
                type="number"
                min="1"
                value={inputTokensPerPrompt}
                onChange={(e) => setInputTokensPerPrompt(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="output-tokens">
                Output Tokens/Prompt
                <InfoTooltip content="Average number of tokens in the AI's response. Output tokens are typically more expensive than input tokens." />
              </Label>
              <Input
                id="output-tokens"
                type="number"
                min="1"
                value={outputTokensPerPrompt}
                onChange={(e) => setOutputTokensPerPrompt(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Advanced Toggle */}
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="advanced"
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
            <Label htmlFor="advanced">Show advanced options</Label>
          </div>
          
          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 pt-2 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="context-window">
                  Context Window
                  <InfoTooltip content="The maximum number of tokens the model can process in a single conversation. Larger context windows allow for longer conversations but may affect pricing." />
                </Label>
                <Select
                  value={contextWindow}
                  onValueChange={setContextWindow}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select context size" />
                  </SelectTrigger>
                  <SelectContent>
                    {contextWindowOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Results Card */}
      <Card className="glass-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-theme-blue-50 to-theme-blue-100 opacity-50" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-theme-blue-700">Your Results</CardTitle>
          <CardDescription>
            Based on your inputs, here's what you can expect
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <span className="text-sm font-medium">Total tokens used per month</span>
              <span className="text-lg font-semibold">{totalTokensPerMonth.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <span className="text-sm font-medium">Estimated monthly cost</span>
              <span className="text-lg font-semibold text-theme-blue-700">${monthlyCost.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <span className="text-sm font-medium">Cost per user</span>
              <span className="text-lg font-semibold">${costPerUser.toFixed(4)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <div>
                <span className="text-sm font-medium">Minimum price per user</span>
                <InfoTooltip content="This is the minimum price you should charge per user to maintain a 40% profit margin." />
              </div>
              <span className="text-xl font-semibold text-theme-blue-600">${minimumPrice.toFixed(2)}</span>
            </div>
            
            <div className="mt-6 p-4 bg-theme-blue-50 rounded-lg">
              <div className="font-medium mb-2 text-theme-blue-700">Suggested Pricing Strategy</div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-theme-blue-100 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-theme-blue-600">
                    <rect width="6" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="9" x="14" y="11" rx="2" />
                    <path d="M22 11h-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">{suggestedStrategy}</p>
                  {suggestedStrategy === "Flat Rate" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Works best if your usage per user is predictable.
                    </p>
                  )}
                  {suggestedStrategy === "Tiered Pricing" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Works well when user behavior varies widely.
                    </p>
                  )}
                  {suggestedStrategy === "Usage-based Pricing" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Ideal for API-heavy platforms with variable usage patterns.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCalculator;
