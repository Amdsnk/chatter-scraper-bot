
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ScraperService from '@/services/ScraperService';

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
  isDisabled?: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlSubmit, isDisabled }) => {
  const [url, setUrl] = useState('https://herefordsondemand.com/find-a-breeder/');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a valid URL to scrape",
        variant: "destructive",
      });
      return;
    }
    
    if (!ScraperService.isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL with http:// or https://",
        variant: "destructive",
      });
      return;
    }
    
    onUrlSubmit(url);
    
    toast({
      title: "URL submitted",
      description: "Now you can chat with AI about this website",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Link2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL to scrape"
            className="pl-9 h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            disabled={isDisabled}
          />
        </div>
        <Button 
          type="submit"
          disabled={isDisabled}
          className="h-10 transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Set URL
        </Button>
      </div>
    </form>
  );
};

export default UrlInput;
