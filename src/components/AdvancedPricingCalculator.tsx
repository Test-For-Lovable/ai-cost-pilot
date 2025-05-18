import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Calculator, Download, BarChart, Target, TrendingUp } from 'lucide-react';
import InfoTooltip from './InfoTooltip';
import { modelOptions, contextWindowOptions, ModelPricing } from '@/data/modelData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  
  // Target ROI settings
  const [targetROI, setTargetROI] = useState<number>(50);
  const [targetUsers, setTargetUsers] = useState<number>(1000);
  const [targetInvestment, setTargetInvestment] = useState<number>(10000);
  const [growthRate, setGrowthRate] = useState<number>(15);
  const [timeToBreakeven, setTimeToBreakeven] = useState<number>(6);
  const [freeTierPercentage, setFreeTierPercentage] = useState<number>(20);
  
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
  
  // Target-based recommendations
  const [recommendedTierPricing, setRecommendedTierPricing] = useState<{
    free: {price: number, features: string[], limit: number},
    basic: {price: number, features: string[], limit: number},
    pro: {price: number, features: string[], limit: number},
    enterprise: {price: number, features: string[], limit: number}
  }>({
    free: {price: 0, features: [], limit: 0},
    basic: {price: 0, features: [], limit: 0},
    pro: {price: 0, features: [], limit: 0},
    enterprise: {price: 0, features: [], limit: 0}
  });
  const [revenueProjection, setRevenueProjection] = useState<{month: number, revenue: number, cost: number, profit: number}[]>([]);
  
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

  // Calculate target-based recommendations
  const calculateTargetRecommendations = () => {
    // Base calculations
    const effectivePrompts = promptsPerUser * (1 - (cacheRate / 100));
    const inputTotal = monthlyUsers * effectivePrompts * inputTokensPerPrompt;
    const outputTotal = monthlyUsers * effectivePrompts * outputTokensPerPrompt;
    const baseCost = ((inputTotal / 1000) * selectedModel.inputPrice) + 
                     ((outputTotal / 1000) * selectedModel.outputPrice);
    
    // Calculate costs including all factors
    const totalBaseCost = baseCost + calculateAdditionalCosts();
    
    // Factor in deployment type
    let adjustedCost = totalBaseCost;
    if (deploymentType === 'hybrid') adjustedCost *= 1.2;
    if (deploymentType === 'onprem') adjustedCost *= 1.5;
    
    // Calculate price needed to achieve target ROI
    const targetMargin = targetROI / 100;
    const priceForTargetROI = adjustedCost / monthlyUsers / (1 - targetMargin);
    
    // Calculate break-even point based on target investment
    const monthlyProfit = (priceForTargetROI * monthlyUsers) - adjustedCost;
    const calculatedBreakEvenMonths = targetInvestment / monthlyProfit;
    
    // Define tier features and limits based on usage patterns
    const freeTierLimit = Math.ceil(promptsPerUser * (freeTierPercentage / 100));
    
    // Create revenue projection for the next 12 months
    const projection = [];
    let currentUsers = monthlyUsers;
    let monthlyGrowthRate = growthRate / 100;
    
    for (let i = 1; i <= 12; i++) {
      // Apply monthly growth rate to user count
      if (i > 1) {
        currentUsers = Math.floor(currentUsers * (1 + monthlyGrowthRate));
      }
      
      // Calculate monthly metrics
      const monthlyRevenue = currentUsers * priceForTargetROI;
      const monthlyCostProjected = (currentUsers / monthlyUsers) * adjustedCost;
      const monthlyProfitProjected = monthlyRevenue - monthlyCostProjected;
      
      projection.push({
        month: i,
        revenue: monthlyRevenue,
        cost: monthlyCostProjected,
        profit: monthlyProfitProjected
      });
    }
    
    // Set recommended tier pricing
    setRecommendedTierPricing({
      free: {
        price: 0,
        features: [
          `${freeTierLimit} AI interactions per month`,
          "Basic models only",
          "Standard response time"
        ],
        limit: freeTierLimit
      },
      basic: {
        price: Math.ceil(priceForTargetROI),
        features: [
          `${promptsPerUser} AI interactions per month`,
          "All models",
          "Fast response time",
          "Basic analytics"
        ],
        limit: promptsPerUser
      },
      pro: {
        price: Math.ceil(priceForTargetROI * 2.5),
        features: [
          `${promptsPerUser * 3} AI interactions per month`,
          "All models including fine-tuned",
          "Priority response time",
          "Advanced analytics",
          "Dedicated support"
        ],
        limit: promptsPerUser * 3
      },
      enterprise: {
        price: Math.ceil(priceForTargetROI * 8),
        features: [
          "Unlimited AI interactions",
          "Custom model fine-tuning",
          "Fastest response time",
          "Full analytics suite",
          "Dedicated account manager",
          "SLA guarantees"
        ],
        limit: promptsPerUser * 10
      }
    });
    
    // Set revenue projection
    setRevenueProjection(projection);
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
    
    // Calculate target-based recommendations if we're on the targets tab
    if (activeTab === "targets") {
      calculateTargetRecommendations();
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
    highAvailability,
    activeTab,
    targetROI,
    targetUsers,
    targetInvestment,
    growthRate,
    timeToBreakeven,
    freeTierPercentage
  ]);
  
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Tiers</TabsTrigger>
          <TabsTrigger value="targets">Growth & Targets</TabsTrigger>
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
              
              {/* New Tab: Growth & Targets */}
              <TabsContent value="targets" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-theme-blue-600" />
                    <span>Set Your Business Targets</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">Define your growth and ROI targets to get customized pricing recommendations</p>
                  
                  {/* Target ROI */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="target-roi">
                        Target ROI (%)
                        <InfoTooltip content="Your desired return on investment percentage. Higher ROI requires higher pricing." />
                      </Label>
                      <span className="text-sm font-medium">{targetROI}%</span>
                    </div>
                    <Slider
                      id="target-roi"
                      min={10}
                      max={200}
                      step={5}
                      value={[targetROI]}
                      onValueChange={(value) => setTargetROI(value[0])}
                    />
                  </div>
                  
                  {/* Target Users */}
                  <div className="space-y-2">
                    <Label htmlFor="target-users">
                      Target User Count (6 months)
                      <InfoTooltip content="How many users you aim to have in the next 6 months." />
                    </Label>
                    <Input
                      id="target-users"
                      type="number"
                      min="1"
                      value={targetUsers}
                      onChange={(e) => setTargetUsers(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Initial Investment */}
                  <div className="space-y-2">
                    <Label htmlFor="investment">
                      Initial Investment ($)
                      <InfoTooltip content="Your initial investment or runway that needs to be recouped." />
                    </Label>
                    <Input
                      id="investment"
                      type="number"
                      min="0"
                      value={targetInvestment}
                      onChange={(e) => setTargetInvestment(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Monthly Growth Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="growth-rate">
                        Monthly Growth Rate (%)
                        <InfoTooltip content="Your expected month-over-month user growth percentage." />
                      </Label>
                      <span className="text-sm font-medium">{growthRate}%</span>
                    </div>
                    <Slider
                      id="growth-rate"
                      min={1}
                      max={50}
                      step={1}
                      value={[growthRate]}
                      onValueChange={(value) => setGrowthRate(value[0])}
                    />
                  </div>
                  
                  {/* Free Tier Percentage */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="free-tier">
                        Free Tier Allowance (%)
                        <InfoTooltip content="What percentage of your standard usage will you offer in the free tier." />
                      </Label>
                      <span className="text-sm font-medium">{freeTierPercentage}%</span>
                    </div>
                    <Slider
                      id="free-tier"
                      min={5}
                      max={50}
                      step={5}
                      value={[freeTierPercentage]}
                      onValueChange={(value) => setFreeTierPercentage(value[0])}
                    />
                  </div>
                  
                  <Button 
                    onClick={calculateTargetRecommendations}
                    className="w-full mt-4"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Recommendations
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
          
          {/* Results Card */}
          <Card className="glass-card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-theme-blue-50 to-theme-blue-100 opacity-50" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-theme-blue-700">
                {activeTab === "targets" ? "Target-Based Recommendations" : "Advanced Results"}
              </CardTitle>
              <CardDescription>
                {activeTab === "targets" 
                  ? "Optimized pricing tiers based on your business targets"
                  : "Comprehensive cost analysis based on your detailed inputs"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              {/* Show different content based on active tab */}
              {activeTab !== "targets" ? (
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
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-theme-blue-700 mb-3">Recommended Pricing Tiers</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Free Tier */}
                      <div className="p-4 border rounded-lg bg-white/90">
                        <div className="font-medium text-lg mb-1">Free Tier</div>
                        <div className="text-2xl font-bold mb-3">$0</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Limit: {recommendedTierPricing.free.limit} prompts/month
                        </div>
                        <ul className="text-sm space-y-2">
                          {recommendedTierPricing.free.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-theme-blue-500 text-lg">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Basic Tier */}
                      <div className="p-4 border rounded-lg bg-white/90 border-theme-blue-200">
                        <div className="font-medium text-lg mb-1">Basic</div>
                        <div className="text-2xl font-bold mb-3">${recommendedTierPricing.basic.price}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Limit: {recommendedTierPricing.basic.limit} prompts/month
                        </div>
                        <ul className="text-sm space-y-2">
                          {recommendedTierPricing.basic.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-theme-blue-500 text-lg">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Professional Tier */}
                      <div className="p-4 border rounded-lg bg-white/90 border-theme-blue-300">
                        <div className="font-medium text-lg mb-1">Professional</div>
                        <div className="text-2xl font-bold mb-3">${recommendedTierPricing.pro.price}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Limit: {recommendedTierPricing.pro.limit} prompts/month
                        </div>
                        <ul className="text-sm space-y-2">
                          {recommendedTierPricing.pro.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-theme-blue-500 text-lg">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Enterprise Tier */}
                      <div className="p-4 border rounded-lg bg-white/90 border-theme-blue-400">
                        <div className="font-medium text-lg mb-1">Enterprise</div>
                        <div className="text-2xl font-bold mb-3">${recommendedTierPricing.enterprise.price}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Unlimited usage
                        </div>
                        <ul className="text-sm space-y-2">
                          {recommendedTierPricing.enterprise.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-theme-blue-500 text-lg">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Revenue Projection */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-theme-blue-700 mb-3">12-Month Revenue Projection</h3>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Profit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {revenueProjection.map((month) => (
                            <TableRow key={month.month}>
                              <TableCell>{month.month}</TableCell>
                              <TableCell>${Math.round(month.revenue).toLocaleString()}</TableCell>
                              <TableCell>${Math.round(month.cost).toLocaleString()}</TableCell>
                              <TableCell className={month.profit > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                ${Math.round(month.profit).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" className="gap-1">
                      <Download className="h-4 w-4" />
                      <span>Export Plan</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default AdvancedPricingCalculator;
