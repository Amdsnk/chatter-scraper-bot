import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { SendIcon, Loader2Icon } from 'lucide-react';
import Message from './Message';
import ResultsView from './ResultsView';
import UrlInput from './UrlInput';
import AIService from '@/services/AIService';
import { Message as MessageType, ScrapingResult } from '@/types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageResults, setMessageResults] = useState<{[key: string]: ScrapingResult[]}>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize session
  useEffect(() => {
    const newSessionId = AIService.createSession();
    setSessionId(newSessionId);
    
    // Welcome message
    const welcomeMessage: MessageType = {
      id: uuidv4(),
      type: 'assistant',
      content: "Hello! I'm your AI scraping assistant. To get started, please set a URL to scrape, then you can ask me to extract data from that website.",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleUrlSubmit = (url: string) => {
    setCurrentUrl(url);
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault(); // Prevent form submission default behavior (page refresh)
    }
    
    if (!input.trim()) return;
    
    if (!currentUrl) {
      toast({
        title: "URL required",
        description: "Please set a URL to scrape first",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message to chat
    const userMessageId = uuidv4();
    const userMessage: MessageType = {
      id: userMessageId,
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Process message with AI service
      const response = await AIService.processMessage(sessionId, input, currentUrl);
      
      // Add assistant message after processing
      const assistantMessageId = uuidv4();
      const assistantMessage: MessageType = {
        id: assistantMessageId,
        type: 'assistant',
        content: response.text,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Store results with the assistant message ID
      if (response.results && response.results.length > 0) {
        setMessageResults(prev => ({
          ...prev,
          [assistantMessageId]: response.results
        }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: MessageType = {
        id: uuidv4(),
        type: 'assistant',
        content: "I'm sorry, but I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to process your message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto h-full gap-6">
      <div className="space-y-4">
        <Card className="overflow-hidden glassmorphism border border-border/50">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-medium mb-4">Web Scraping Chat</h2>
            <UrlInput onUrlSubmit={handleUrlSubmit} isDisabled={isLoading} />
          </div>
        </Card>
      </div>
      
      <Card className="flex-1 flex flex-col glassmorphism border border-border/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hidden">
          <div className="space-y-4">
            {messages.map((message, index) => {
              // Use a div with a key instead of React.Fragment to avoid the warning
              return (
                <div key={message.id}>
                  <Message message={message} />
                  
                  {/* Show results after assistant message if available */}
                  {message.type === 'assistant' && messageResults[message.id] && (
                    <div className="mt-4 animate-fade-in">
                      <ResultsView results={messageResults[message.id]} />
                    </div>
                  )}
                  
                  {isLoading && 
                   index === messages.length - 1 && 
                   message.type === 'user' && (
                    <Message 
                      key="loading" 
                      message={{
                        id: "loading",
                        type: 'assistant',
                        content: '',
                        timestamp: new Date(),
                        isLoading: true
                      }} 
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-4 border-t border-border/50 bg-background/30 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to scrape data from the website..."
              className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                <SendIcon className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;