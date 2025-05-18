
import React, { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdvancedPricingCalculator from '@/components/AdvancedPricingCalculator';

const AdvancedCalculator: React.FC = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  
  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header showAdvancedLink={false} />
      
      <main className="flex-grow">
        <div className="container max-w-7xl mx-auto px-4 space-y-10 md:space-y-16 py-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-theme-blue-700 mb-4">
              Advanced AI Pricing Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fine-tune your AI implementation costs with detailed parameters and get customized pricing recommendations for your specific use case.
            </p>
          </div>
          
          <div id="calculator" ref={calculatorRef} className="scroll-mt-24">
            <AdvancedPricingCalculator />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdvancedCalculator;
