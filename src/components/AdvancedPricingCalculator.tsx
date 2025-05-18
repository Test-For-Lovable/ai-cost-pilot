
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Calculator, Download, BarChart } from 'lucide-react';
import InfoTooltip from './InfoTooltip';
import { modelOptions, contextWindowOptions, ModelPricing } from '@/data/modelData';

// Advanced calculator data
const deploymentOptions = [
  { id: 'cloud', name: 'Cloud-based' },
  { id: 'hybrid', name: 'Hybrid Deployment' },
  { id: 'onprem', name: 'On-premises' }
];

const scalingFactors = [
  { id: 'linear', name: 'Linear Scaling' },
  { id: 'sublinear', name: 'Sub-linear Scaling' },
  { id: 'exponential', name: 'Exponential Scaling' }
];

const usageTiers = [
  { tier: 'Free Tier', userCount: 100, promptsPerUser: 5, revenue: 0 },
  { tier: 'Starter', userCount: 500, promptsPerUser: 20, revenue: 10 },
  { tier: 'Professional', userCount: 1000, promptsPerUser: 50, revenue: 25 },
  { tier: 'Enterprise', userCount: 5000, promptsPerUser: 100, revenue: 100 }
];

const AdvancedPricingCalculator: React.FC = () => {
  // Base form state
  const [selectedModel, setSelectedModel] = useState<ModelPricing>(modelOptions[0]);
  const [monthlyUsers, setMonthlyUsers] = useState<number>(100);
  const [promptsPerUser, setPromptsPerUser] = useState<number>(10);
  const [inputTokensPerPrompt, setInputTokensPerPrompt] = useState<number>(200);
  const [outputTokensPerPrompt, setOutputTokensPerPrompt] = useState<number>(800);
  const [contextWindow, setContextWindow] = useState<string>("8k");
  const [retentionRate, setRetentionRate] = useState<number>(85);
  const [cacheRate, setCacheRate] = useState<number>(20);
  const [deploymentType, setDeploymentType] = useState<string>("cloud");
  const [scalingFactor, setScalingFactor] = useState<string>("linear");
  const [activeTab, setActiveTab] = useState<string>("basic");
  
  // Advanced settings
  const [finetuning, setFinetuning] = useState<boolean>(false);
  const [embeddings, setEmbeddings] = useState<boolean>(false);
  const [vectorDB, setVectorDB] = useState<boolean>(false);
  const [redundancy, setRedundancy] = useState<boolean>(false);
  const [highAvailability, setHighAvailability] = useState<boolean>(false);
  
  // Custom pricing tiers
  const [customTiers, setCustomTiers] = useState(usageTiers);
  
  // Results state
  const [totalTokensPerMonth, setTotalTokensPerMonth] = useState<number>(0);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  const [costPerUser, setCostPerUser] = useState<number>(0);
  const [minimumPrice, setMinimumPrice] = useState<number>(0);
  const [roi, setRoi] = useState<number>(0);
  const [breakEvenUsers, setBreakEvenUsers] = useState<number>(0);
  const [suggestedPricing, setSuggestedPricing] = useState<{basic: number, pro: number, enterprise: number}>({
    basic: 0,
    pro: 0,
    enterprise: 0
  });
  const [suggestedStrategy, setSuggestedStrategy] = useState<string>("");
  
  // Calculate additional costs
  const calculateAdditionalCosts = () => {
    let additionalCost = 0;
    
    if (finetuning) additionalCost += 500; // Fine-tuning cost
    if (embeddings) additionalCost += monthlyUsers * promptsPerUser * 0.001; // Embeddings cost
    if (vectorDB) additionalCost += 50 + (monthlyUsers * 0.001); // Vector DB cost
    if (redundancy) additionalCost += monthlyCost * 0.3; // 30% additional for redundancy
    if (highAvailability) additionalCost += monthlyCost * 0.5; // 50% additional for high availability
    
    return additionalCost;
  };
  
  // Calculate results whenever inputs change
  useEffect(() => {
    if (!selectedModel) return;
    
    // Factor in cache rate (reduces tokens needed)
    const effectivePrompts = promptsPerUser * (1 - (cacheRate / 100));
    
    // Calculate base token usage
    const inputTotal = monthlyUsers * effectivePrompts * inputTokensPerPrompt;
    const outputTotal = monthlyUsers * effectivePrompts * outputTokensPerPrompt;
    const totalTokens = inputTotal + outputTotal;
    
    // Calculate base costs
    const inputCost = (inputTotal / 1000) * selectedModel.inputPrice;
    const outputCost = (outputTotal / 1000) * selectedModel.outputPrice;
    let totalCost = inputCost + outputCost;
    
    // Add additional costs
    totalCost += calculateAdditionalCosts();
    
    // Deployment factor
    if (deploymentType === 'hybrid') totalCost *= 1.2; // 20% more expensive
    if (deploymentType === 'onprem') totalCost *= 1.5; // 50% more expensive
    
    // Scaling factor adjustment (for future projections)
    // This doesn't affect current costs but would be used for growth projections
    
    const userCost = totalCost / monthlyUsers;
    
    // Suggested minimum price with 40% margin
    const margin = 0.4;
    const suggestedPrice = userCost / (1 - margin);
    
    // Return on investment calculation
    // Assuming average revenue per user based on suggested price
    const averageRevenue = suggestedPrice * monthlyUsers * (retentionRate / 100);
    const calculatedRoi = ((averageRevenue - totalCost) / totalCost) * 100;
    
    // Break even calculation
    const calculatedBreakEvenUsers = Math.ceil(totalCost / suggestedPrice);
    
    // Set state
    setTotalTokensPerMonth(totalTokens);
    setMonthlyCost(totalCost);
    setCostPerUser(userCost);
    setMinimumPrice(suggestedPrice);
    setRoi(calculatedRoi);
    setBreakEvenUsers(calculatedBreakEvenUsers);
    
    // Suggested tiered pricing
    setSuggestedPricing({
      basic: Math.ceil(suggestedPrice),
      pro: Math.ceil(suggestedPrice * 2.5),
      enterprise: Math.ceil(suggestedPrice * 10)
    });
    
    // Determine pricing strategy based on usage pattern
    if (promptsPerUser < 5) {
      setSuggestedStrategy("Flat Rate");
    } else if (promptsPerUser >= 5 && promptsPerUser < 20) {
      setSuggestedStrategy("Tiered Pricing");
    } else {
      setSuggestedStrategy("Usage-based Pricing");
    }
  }, [
    selectedModel,
    monthlyUsers,
    promptsPerUser,
    inputTokensPerPrompt,
    outputTokensPerPrompt,
    contextWindow,
    retentionRate,
    cacheRate,
    deploymentType,
    scalingFactor,
    finetuning,
    embeddings,
    vectorDB,
    redundancy,
    highAvailability
  ]);
  
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Tiers</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-theme-blue-500" />
                <span>Advanced AI Cost Calculator</span>
              </CardTitle>
              <CardDescription>
                Fine-tune your AI implementation costs with detailed parameters
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="basic" className="space-y-6">
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
                
                {/* Context Window */}
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
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-6">
                {/* Retention Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="retention">
                      User Retention Rate (%)
                      <InfoTooltip content="The percentage of users who continue using your application month-over-month." />
                    </Label>
                    <span className="text-sm font-medium">{retentionRate}%</span>
                  </div>
                  <Slider
                    id="retention"
                    min={10}
                    max={100}
                    step={1}
                    value={[retentionRate]}
                    onValueChange={(value) => setRetentionRate(value[0])}
                  />
                </div>
                
                {/* Cache Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="cache">
                      Cache Hit Rate (%)
                      <InfoTooltip content="The percentage of AI queries that can be served from cache, reducing token usage and costs." />
                    </Label>
                    <span className="text-sm font-medium">{cacheRate}%</span>
                  </div>
                  <Slider
                    id="cache"
                    min={0}
                    max={90}
                    step={1}
                    value={[cacheRate]}
                    onValueChange={(value) => setCacheRate(value[0])}
                  />
                </div>
                
                {/* Deployment Type */}
                <div className="space-y-2">
                  <Label htmlFor="deployment">
                    Deployment Type
                    <InfoTooltip content="Different deployment options have different cost implications. Cloud is typically cheapest for getting started, while on-premises may have higher upfront costs but lower variable costs." />
                  </Label>
                  <Select
                    value={deploymentType}
                    onValueChange={setDeploymentType}
                  >
                    <SelectTrigger id="deployment" className="w-full">
                      <SelectValue placeholder="Select deployment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deploymentOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Scaling Factor */}
                <div className="space-y-2">
                  <Label htmlFor="scaling">
                    User Growth Projection
                    <InfoTooltip content="How you expect user growth to impact your costs. Linear means costs grow directly with users; sub-linear means economies of scale; exponential means costs grow faster than user count." />
                  </Label>
                  <Select
                    value={scalingFactor}
                    onValueChange={setScalingFactor}
                  >
                    <SelectTrigger id="scaling" className="w-full">
                      <SelectValue placeholder="Select scaling model" />
                    </SelectTrigger>
                    <SelectContent>
                      {scalingFactors.map((option) => (
                        <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Additional Features */}
                <div className="space-y-4 pt-2 border-t">
                  <h3 className="font-medium text-sm">Additional Features</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="finetuning">Custom Fine-tuning</Label>
                      <p className="text-xs text-muted-foreground">Train the model on your data ($500/mo)</p>
                    </div>
                    <Switch
                      id="finetuning"
                      checked={finetuning}
                      onCheckedChange={setFinetuning}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="embeddings">Text Embeddings</Label>
                      <p className="text-xs text-muted-foreground">Vector embeddings for semantic search</p>
                    </div>
                    <Switch
                      id="embeddings"
                      checked={embeddings}
                      onCheckedChange={setEmbeddings}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vectordb">Vector Database</Label>
                      <p className="text-xs text-muted-foreground">Store and query vector embeddings ($50/mo base)</p>
                    </div>
                    <Switch
                      id="vectordb"
                      checked={vectorDB}
                      onCheckedChange={setVectorDB}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="redundancy">Model Redundancy</Label>
                      <p className="text-xs text-muted-foreground">Fallback models for reliability (+30%)</p>
                    </div>
                    <Switch
                      id="redundancy"
                      checked={redundancy}
                      onCheckedChange={setRedundancy}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ha">High Availability</Label>
                      <p className="text-xs text-muted-foreground">Multi-region deployment for uptime (+50%)</p>
                    </div>
                    <Switch
                      id="ha"
                      checked={highAvailability}
                      onCheckedChange={setHighAvailability}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Pricing Tier Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure your pricing tiers based on different user segments</p>
                  
                  {customTiers.map((tier, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-3">
                      <div className="font-medium">{tier.tier}</div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`tier-${index}-users`} className="text-xs">User Count</Label>
                          <Input 
                            id={`tier-${index}-users`}
                            type="number"
                            min="1"
                            value={tier.userCount}
                            onChange={(e) => {
                              const newTiers = [...customTiers];
                              newTiers[index].userCount = parseInt(e.target.value) || 0;
                              setCustomTiers(newTiers);
                            }}
                            className="h-8"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`tier-${index}-prompts`} className="text-xs">Prompts/User</Label>
                          <Input 
                            id={`tier-${index}-prompts`}
                            type="number"
                            min="1"
                            value={tier.promptsPerUser}
                            onChange={(e) => {
                              const newTiers = [...customTiers];
                              newTiers[index].promptsPerUser = parseInt(e.target.value) || 0;
                              setCustomTiers(newTiers);
                            }}
                            className="h-8"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`tier-${index}-price`} className="text-xs">Price/User ($)</Label>
                        <Input 
                          id={`tier-${index}-price`}
                          type="number"
                          min="0"
                          value={tier.revenue}
                          onChange={(e) => {
                            const newTiers = [...customTiers];
                            newTiers[index].revenue = parseInt(e.target.value) || 0;
                            setCustomTiers(newTiers);
                          }}
                          className="h-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
          
          {/* Results Card */}
          <Card className="glass-card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-theme-blue-50 to-theme-blue-100 opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-theme-blue-700">Advanced Results</CardTitle>
              <CardDescription>
                Comprehensive cost analysis based on your detailed inputs
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
                
                <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
                  <span className="text-sm font-medium">Projected ROI</span>
                  <span className="text-lg font-semibold text-theme-blue-700">{roi.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-theme-blue-100">
                  <span className="text-sm font-medium">Break-even user count</span>
                  <span className="text-lg font-semibold">{breakEvenUsers.toLocaleString()}</span>
                </div>
                
                <div className="p-4 bg-theme-blue-50 rounded-lg space-y-4">
                  <div className="font-medium text-theme-blue-700">Suggested Pricing Tiers</div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 border border-theme-blue-200 rounded bg-white/60">
                      <div className="text-xs text-muted-foreground">Basic</div>
                      <div className="font-semibold">${suggestedPricing.basic}/mo</div>
                    </div>
                    <div className="p-2 border border-theme-blue-200 rounded bg-white/60">
                      <div className="text-xs text-muted-foreground">Professional</div>
                      <div className="font-semibold">${suggestedPricing.pro}/mo</div>
                    </div>
                    <div className="p-2 border border-theme-blue-200 rounded bg-white/60">
                      <div className="text-xs text-muted-foreground">Enterprise</div>
                      <div className="font-semibold">${suggestedPricing.enterprise}/mo</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-theme-blue-50 rounded-lg">
                  <div className="font-medium mb-2 text-theme-blue-700">Recommended Strategy</div>
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
                          Best for your current usage pattern with predictable per-user costs.
                        </p>
                      )}
                      {suggestedStrategy === "Tiered Pricing" && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Recommended for your mixed usage pattern across different user types.
                        </p>
                      )}
                      {suggestedStrategy === "Usage-based Pricing" && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Optimal for your high-volume usage with variable consumption patterns.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </Button>
                <Button className="gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>View Projection</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default AdvancedPricingCalculator;
