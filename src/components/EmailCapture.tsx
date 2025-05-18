
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
  className?: string;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ onSubmit, className = "" }) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you'd send this to your backend or email service
      console.log("Email captured:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Success!",
        description: "Your detailed AI pricing guide is on its way to your inbox!",
      });
      
      onSubmit(email);
      setEmail("");
    } catch (error) {
      console.error("Error submitting email:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-4 bg-theme-blue-50 rounded-lg shadow-sm border border-theme-blue-100 ${className}`}>
      <h3 className="text-lg font-medium text-theme-blue-700 mb-2">
        Get Your Free AI Pricing Guide
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Enter your email to receive a detailed breakdown of AI costs and pricing strategies tailored for your business.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            disabled={isLoading}
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-theme-blue-600 hover:bg-theme-blue-700"
        >
          {isLoading ? "Sending..." : "Get Free Guide"}
        </Button>
      </form>
    </div>
  );
};

export default EmailCapture;
