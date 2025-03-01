
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary/30">
      <div className="container py-8 sm:py-12 px-4 sm:px-6 min-h-screen flex flex-col">
        <header className="mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground animate-fade-in">
                AI-Powered Web Scraping
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight animate-slide-down">
                Chat with AI about any website
              </h1>
              <p className="text-muted-foreground max-w-2xl animate-slide-down [animation-delay:0.1s]">
                Simply enter a URL, then ask the AI to extract specific data from the website. The AI will scrape the site and return the results in a structured format.
              </p>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col">
          <div className="h-full animate-fade-in [animation-delay:0.2s]">
            <ChatInterface />
          </div>
        </main>
        
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>AI Web Scraping Chat — Created with Lovable</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
