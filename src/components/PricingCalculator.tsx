import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import InfoTooltip from './InfoTooltip';
import { modelOptions, contextWindowOptions, ModelPricing, presetOptions, PresetOption } from '@/data/modelData';
import { Calculator, Users, MessageSquare, CircleHelp, DollarSign, Check, TrendingUp, BarChart2, CircleDot } from 'lucide-react';

// Conversion factor from words to tokens (approximate)
const WORDS_TO_TOKENS_FACTOR = 1.3;

const PricingCalculator: React.FC = () => {
  // Form state
  const [selectedModel, setSelectedModel] = useState<ModelPricing>(modelOptions[0]);
  const [monthlyUsers, setMonthlyUsers] = useState<number>(100);
  const [promptsPerUser, setPromptsPerUser] = useState<number>(10);
  const [responseLength, setResponseLength] = useState<number>(500);
  const [inputLength, setInputLength] = useState<number>(200);
  const [outputLength, setOutputLength] = useState<number>(800);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [contextWindow, setContextWindow] = useState<string>("8k");
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  
  // Results state
  const [totalTokensPerMonth, setTotalTokensPerMonth] = useState<number>(0);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  const [costPerUser, setCostPerUser] = useState<number>(0);
  const [minimumPrice, setMinimumPrice] = useState<number>(0);
  const [suggestedStrategy, setSuggestedStrategy] = useState<string>("");
  const [breakEvenUsers, setBreakEvenUsers] = useState<number>(0);
  const [roi, setRoi] = useState<number>(0);
  
  // Apply preset configuration
  const applyPreset = (presetId: string) => {
    const preset = presetOptions.find(p => p.id === presetId);
    if (!preset) return;
    
    setSelectedPreset(presetId);
    
    // Apply preset values
    const model = modelOptions.find(m => m.id === preset.model);
    if (model) setSelectedModel(model);
    
    setMonthlyUsers(preset.monthlyUsers);
    setPromptsPerUser(preset.promptsPerUser);
    setResponseLength(preset.responseLength);
    setInputLength(preset.inputLength);
    setOutputLength(preset.outputLength);
    setContextWindow(preset.contextWindow);
  };
  
  // Calculate results whenever inputs change
  useEffect(() => {
    if (!selectedModel) return;
    
    let inputTokens, outputTokens;
    
    if (showAdvanced) {
      // Use the specific input and output lengths
      inputTokens = inputLength * WORDS_TO_TOKENS_FACTOR;
      outputTokens = outputLength * WORDS_TO_TOKENS_FACTOR;
    } else {
      // When using simplified interface, we use response length
      // and estimate input/output proportions (20% input, 80% output typically)
      const totalTokens = responseLength * WORDS_TO_TOKENS_FACTOR;
      inputTokens = totalTokens * 0.2;
      outputTokens = totalTokens * 0.8;
    }
    
    const inputTotal = monthlyUsers * promptsPerUser * inputTokens;
    const outputTotal = monthlyUsers * promptsPerUser * outputTokens;
    const totalTokens = inputTotal + outputTotal;
    
    const inputCost = (inputTotal / 1000) * selectedModel.inputPrice;
    const outputCost = (outputTotal / 1000) * selectedModel.outputPrice;
    const totalCost = inputCost + outputCost;
    
    const userCost = totalCost / monthlyUsers;
    
    // Suggested minimum price with 40% margin
    const suggestedPrice = userCost * 1.4;
    
    // Calculate ROI (Return on Investment)
    const estimatedRoi = (suggestedPrice / userCost - 1) * 100;
    
    // Calculate break-even point (users needed to cover costs)
    // Assuming fixed costs of $100 per month for hosting, etc.
    const fixedCosts = 100;
    const revenuePerUser = suggestedPrice;
    const variableCostPerUser = userCost;
    const contributionMargin = revenuePerUser - variableCostPerUser;
    const breakEven = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    
    setTotalTokensPerMonth(totalTokens);
    setMonthlyCost(totalCost);
    setCostPerUser(userCost);
    setMinimumPrice(suggestedPrice);
    setRoi(estimatedRoi);
    setBreakEvenUsers(breakEven);
    
    // Determine pricing strategy based on usage pattern
    if (promptsPerUser < 5) {
      setSuggestedStrategy("Flat Pricing");
    } else if (promptsPerUser >= 5 && promptsPerUser < 20) {
      setSuggestedStrategy("Tiered Pricing");
    } else {
      setSuggestedStrategy("Usage-based Pricing");
    }
    
  }, [selectedModel, monthlyUsers, promptsPerUser, responseLength, inputLength, outputLength, showAdvanced]);
  
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
            Fill in a few details about your app to see costs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Templates Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="preset" className="flex items-center">
              <CircleDot className="h-4 w-4 mr-1.5 inline text-theme-blue-500" />
              Or choose a template to auto-fill your numbers:
            </Label>
            <Select
              value={selectedPreset}
              onValueChange={applyPreset}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {presetOptions.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Model Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="model">
              What type of AI model do you use?
              <InfoTooltip content="Different models have different capabilities and costs. Select the one you're planning to use in your app." />
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
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span>{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedModel.name} pricing: ${selectedModel.inputPrice.toFixed(4)} per 1K input words, ${selectedModel.outputPrice.toFixed(4)} per 1K output words
            </p>
          </div>
          
          {/* Monthly Users */}
          <div className="space-y-2">
            <Label htmlFor="users" className="flex items-center">
              <Users className="h-4 w-4 mr-1.5 inline text-theme-blue-500" />
              How many people use your app monthly?
              <InfoTooltip content="This is the number of unique users who will interact with your AI features each month." />
            </Label>
            <Input
              id="users"
              type="number"
              min="1"
              value={monthlyUsers}
              onChange={(e) => setMonthlyUsers(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full"
              placeholder="e.g. 1,000"
            />
          </div>
          
          {/* Prompts Per User */}
          <div className="space-y-2">
            <Label htmlFor="prompts">
              How often does one person use the AI in your app (per month)?
              <InfoTooltip content="How many times each user will ask the AI for something in a month. Each time counts as one prompt." />
            </Label>
            <Input
              id="prompts"
              type="number"
              min="1"
              value={promptsPerUser}
              onChange={(e) => setPromptsPerUser(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full"
              placeholder="e.g. 50 times"
            />
          </div>
          
          {/* Response Length */}
          {!showAdvanced && (
            <div className="space-y-2">
              <Label htmlFor="response-length" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1.5 inline text-theme-blue-500" />
                Average words per AI response
                <InfoTooltip content="How long are typical AI responses in your app? This helps us estimate token usage." />
              </Label>
              <Input
                id="response-length"
                type="number"
                min="1"
                value={responseLength}
                onChange={(e) => setResponseLength(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full"
                placeholder="e.g. 300"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This typically converts to around {Math.round(responseLength * WORDS_TO_TOKENS_FACTOR)} tokens per response
              </p>
            </div>
          )}
          
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
              {/* Input & Output Length */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="input-length">
                    Input Words (approx)
                    <InfoTooltip content="Average number of words in the user's messages. This is used to calculate token usage." />
                  </Label>
                  <Input
                    id="input-length"
                    type="number"
                    min="1"
                    value={inputLength}
                    onChange={(e) => setInputLength(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="output-length">
                    Output Words (approx)
                    <InfoTooltip content="Average number of words in the AI's responses. Output typically costs more than input." />
                  </Label>
                  <Input
                    id="output-length"
                    type="number"
                    min="1"
                    value={outputLength}
                    onChange={(e) => setOutputLength(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context-window">
                  How much memory does the AI use per chat?
                  <InfoTooltip content="This is the maximum length of the conversation the AI can remember. Larger values allow for longer conversations but may affect pricing." />
                </Label>
                <Select
                  value={contextWindow}
                  onValueChange={setContextWindow}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select memory size" />
                  </SelectTrigger>
                  <SelectContent>
                    {contextWindowOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex flex-col">
                          <span>{option.name}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
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
            Based on your inputs, here's what to expect
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <span className="text-sm font-medium flex items-center">
                <CircleHelp className="h-4 w-4 mr-1.5 text-theme-blue-500" />
                You'll use around
              </span>
              <span className="text-lg font-semibold">
                {totalTokensPerMonth > 1000000 
                  ? `${(totalTokensPerMonth / 1000000).toFixed(1)} million` 
                  : totalTokensPerMonth.toLocaleString()
                } words (approx)
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <span className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1.5 text-theme-blue-500" />
                That will cost you around
              </span>
              <span className="text-lg font-semibold text-theme-blue-700">${monthlyCost.toFixed(2)}/month</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <span className="text-sm font-medium">Cost per user</span>
              <span className="text-lg font-semibold">${costPerUser.toFixed(4)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <div>
                <span className="text-sm font-medium flex items-center">
                  <Check className="h-4 w-4 mr-1.5 text-green-500" />
                  You should charge at least
                </span>
                <span className="text-xs text-muted-foreground">to stay profitable</span>
              </div>
              <span className="text-xl font-semibold text-theme-blue-600">${minimumPrice.toFixed(2)}/user</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <span className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-1.5 text-theme-blue-500" />
                You earn for every $1 spent
              </span>
              <span className="text-lg font-semibold text-green-600">
                ${(1 + roi/100).toFixed(2)} (ROI: {Math.round(roi)}%)
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
              <span className="text-sm font-medium flex items-center">
                <BarChart2 className="h-4 w-4 mr-1.5 text-theme-blue-500" />
                You break even with just
              </span>
              <span className="text-lg font-semibold">{breakEvenUsers} users</span>
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
                  {suggestedStrategy === "Flat Pricing" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Good if usage is predictable across your users.
                    </p>
                  )}
                  {suggestedStrategy === "Tiered Pricing" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Best if some users are light and others are heavy users.
                    </p>
                  )}
                  {suggestedStrategy === "Usage-based Pricing" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Best if usage varies a lot between users and months.
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
