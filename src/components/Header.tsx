
import React from 'react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const handleScrollToCalculator = () => {
    const calculatorSection = document.getElementById('calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full py-4 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-theme-blue-600">AI Pricing Calculator</h1>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <Button 
          variant="link" 
          onClick={handleScrollToCalculator}
        >
          Calculator
        </Button>
        <Button 
          variant="ghost" 
          className="text-theme-blue-600 hover:text-theme-blue-700"
        >
          About
        </Button>
      </nav>
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-theme-blue-600"
          onClick={handleScrollToCalculator}
        >
          Calculator
        </Button>
      </div>
    </header>
  );
};

export default Header;
