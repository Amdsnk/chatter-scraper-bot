
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, ChatSession, Message, ScrapingResult } from '@/types';
import ScraperService from './ScraperService';

class AIService {
  private sessions: Map<string, ChatSession> = new Map();
  private sessionTimeouts: Map<string, number> = new Map();
  private readonly SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
  
  // Creates a new chat session
  public createSession(): string {
    const sessionId = uuidv4();
    this.sessions.set(sessionId, {
      id: sessionId,
      messages: [],
      results: [],
      createdAt: Date.now()
    });
    
    // Set a timeout to clean up the session after 10 minutes
    const timeoutId = window.setTimeout(() => {
      this.sessions.delete(sessionId);
      this.sessionTimeouts.delete(sessionId);
    }, this.SESSION_TIMEOUT);
    
    this.sessionTimeouts.set(sessionId, timeoutId);
    
    return sessionId;
  }
  
  // Gets a session by ID
  public getSession(sessionId: string): ChatSession | undefined {
    const session = this.sessions.get(sessionId);
    
    if (session) {
      // Refresh the session timeout when it's accessed
      this.refreshSessionTimeout(sessionId);
    }
    
    return session;
  }
  
  // Refresh the session timeout
  private refreshSessionTimeout(sessionId: string): void {
    // Clear the existing timeout
    const existingTimeout = this.sessionTimeouts.get(sessionId);
    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
    }
    
    // Set a new timeout
    const timeoutId = window.setTimeout(() => {
      this.sessions.delete(sessionId);
      this.sessionTimeouts.delete(sessionId);
    }, this.SESSION_TIMEOUT);
    
    this.sessionTimeouts.set(sessionId, timeoutId);
  }
  
  // Process a chat message
  public async processMessage(sessionId: string, userMessage: string, url?: string): Promise<ApiResponse> {
    // Get or create session
    let session = this.sessions.get(sessionId);
    if (!session) {
      sessionId = this.createSession();
      session = this.sessions.get(sessionId)!;
    } else {
      // Refresh the session timeout when a message is processed
      this.refreshSessionTimeout(sessionId);
    }
    
    // Save URL if provided
    if (url) {
      session.currentUrl = url;
    }
    
    // Add user message to session
    const newUserMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    session.messages.push(newUserMessage);
    
    // Process the message and get real data
    const { text, results } = await this.processUserQuery(session, userMessage);
    
    // Add assistant message to session
    const assistantMessage: Message = {
      id: uuidv4(),
      type: 'assistant',
      content: text,
      timestamp: new Date()
    };
    session.messages.push(assistantMessage);
    
    // Update session results
    if (results.length > 0) {
      session.results = [...session.results, ...results];
    }
    
    return {
      text,
      results,
      sessionId
    };
  }
  
  // Process user query and scrape real data
  private async processUserQuery(session: ChatSession, userMessage: string): Promise<{ text: string; results: ScrapingResult[] }> {
    if (!session.currentUrl) {
      return {
        text: "Please set a URL to scrape first.",
        results: []
      };
    }
    
    const url = session.currentUrl;
    const messageLower = userMessage.toLowerCase();
    
    try {
      // Parse the message to determine scraping parameters
      let pages = 1;
      
      if (messageLower.includes('page 1 until 3') || messageLower.includes('from page 1')) {
        pages = 3;
      } else if (messageLower.includes('all') || messageLower.includes('every')) {
        pages = 5; // Limit to 5 pages for safety
      }
      
      // Scrape the website
      console.log(`Scraping URL: ${url}, Pages: ${pages}`);
      const scrapedData = await ScraperService.scrapeUrl(url, pages);
      
      let responseText = "";
      
      if (scrapedData.length === 0) {
        responseText = "I was unable to extract any data from this website. Please try a different URL or be more specific about what data you need.";
      } else {
        // Filter results if needed
        let results = scrapedData;
        
        if (messageLower.includes('filter') && messageLower.includes('location')) {
          // Extract location filter
          const locationMatch = messageLower.match(/location(?:\s+is|\s+in|\s+equals|\s+contains|\s*:\s*|\s+)?[\s:]*([\w\s]+)/i);
          const locationFilter = locationMatch ? locationMatch[1].trim().toUpperCase() : '';
          
          if (locationFilter) {
            results = scrapedData.filter(item => 
              item.location && item.location.toString().toUpperCase().includes(locationFilter)
            );
            responseText = `I've filtered the data to show only results with location containing '${locationFilter}'. Here are the results:`;
          }
        }
        
        if (messageLower.includes('all') || messageLower.includes('every') || messageLower.includes('get')) {
          responseText = `I've retrieved data from ${url}. Here are the results:`;
        }
        
        if (!responseText) {
          responseText = `I've processed your request and extracted data from ${url}. Here are the results:`;
        }
        
        return { text: responseText, results };
      }
      
      return { text: responseText, results: scrapedData };
    } catch (error) {
      console.error('Error processing query:', error);
      return {
        text: "I encountered an error while processing your request. Please try again with a different URL or query.",
        results: []
      };
    }
  }
}

export default new AIService();
