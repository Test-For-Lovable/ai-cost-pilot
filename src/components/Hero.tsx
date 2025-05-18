
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onCalculatorClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCalculatorClick }) => {
  return (
    <section className="w-full max-w-5xl mx-auto text-center py-10 md:py-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-blue-50 text-theme-blue-600 text-sm font-medium mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-subtle absolute inline-flex h-full w-full rounded-full bg-theme-blue-400 opacity-75"></span>
          </span>
          AI Pricing Calculator
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-theme-blue-700 via-theme-blue-600 to-theme-blue-500 bg-clip-text text-transparent">
          Know Your Costs.<br/>Price Smartly.
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-theme-gray-500 mt-6">
          Estimate token usage, API costs, and break-even pricing for your AI-powered app in minutes.
        </p>
        
        <div className="mt-10">
          <Button 
            size="lg" 
            onClick={onCalculatorClick}
            className="gradient-blue text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Use the Calculator
          </Button>
        </div>
      </div>
      
      <div className="mt-16 md:mt-24 w-full max-w-4xl mx-auto relative h-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-blue-100 to-transparent h-px"></div>
      </div>
    </section>
  );
};

export default Hero;
