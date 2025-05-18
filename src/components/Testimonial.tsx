
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Testimonial: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto py-16">
      <Card className="glass-card border-theme-blue-100">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-theme-blue-300 mb-6">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            
            <blockquote className="text-xl md:text-2xl font-medium text-theme-gray-600 mb-6 italic">
              "Before this calculator, we had no idea how to price our GPT-powered app. Now we're profitable and confident."
            </blockquote>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-theme-blue-100 flex items-center justify-center">
                <span className="font-semibold text-theme-blue-600">SJ</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-theme-gray-500">Founder, AICompanion</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Testimonial;
