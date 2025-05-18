
import React from 'react';
import { Check } from 'lucide-react';

const ValueProposition: React.FC = () => {
  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-sm border border-green-100 mb-6">
      <h3 className="text-lg font-medium text-green-700 mb-2">
        Thanks for subscribing!
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Check your inbox for your detailed AI pricing guide. While you're here, explore the calculator below for real-time cost estimates.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-start gap-2">
          <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm">In-depth pricing strategies for AI apps</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm">Expert-backed profit maximization tips</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm">Case studies of successful AI businesses</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="mt-1 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm">Exclusive discounts on AI services</span>
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;
