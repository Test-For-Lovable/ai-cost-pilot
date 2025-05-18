
import React, { useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PricingCalculator from '@/components/PricingCalculator';
import Testimonial from '@/components/Testimonial';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  
  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container max-w-7xl mx-auto px-4 space-y-10 md:space-y-16">
          <Hero onCalculatorClick={scrollToCalculator} />
          
          <div id="calculator" ref={calculatorRef} className="scroll-mt-24">
            <PricingCalculator />
          </div>
          
          <Testimonial />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
