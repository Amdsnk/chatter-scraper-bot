import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, ChatSession, Message, ScrapingResult } from '@/types';

// Simulated API for demo purposes
// In a real implementation, this would call your backend API
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
    
    // In a real implementation, this would call your backend AI service
    // For demo, we'll simulate a response
    const { text, results } = await this.simulateAIResponse(session, userMessage);
    
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
  
  // Simulate AI response for demo purposes
  private async simulateAIResponse(session: ChatSession, message: string): Promise<{ text: string; results: ScrapingResult[] }> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
    
    const url = session.currentUrl || 'https://herefordsondemand.com/find-a-breeder/';
    
    // Parse the user message to determine action
    const messageLower = message.toLowerCase();
    
    // Sample data (in a real implementation, this would come from actual web scraping)
    const sampleData: ScrapingResult[] = [
      { name: 'Bar S Ranch', phone: '701-824-2046', location: 'MOTT ND' },
      { name: 'Bayard Ranch Co', phone: '308-586-1345', location: 'BRIDGEPORT NE' },
      { name: 'Beery Land & Livestock', phone: '580-821-4183', location: 'ALVA OK' },
      { name: 'Bell Hereford Ranch', phone: '308-834-3494', location: 'THEDFORD NE' },
      { name: 'Berg Farms', phone: '507-220-1946', location: 'PIPESTONE MN' },
      { name: 'Biskner Herefords', phone: '605-848-0777', location: 'ONIDA SD' },
      { name: 'Blackjack Cattle', phone: '701-220-6849', location: 'MOTT ND' },
      { name: 'Blatchford Farms', phone: '701-797-3644', location: 'FINLEY ND' },
      { name: 'Blue Iris Farms', phone: '620-793-2368', location: 'GREAT BEND KS' },
      { name: 'Blueline Herefords', phone: '515-358-0134', location: 'JEFFERSON IA' },
    ];
    
    let results: ScrapingResult[] = [];
    let responseText = '';
    
    if (messageLower.includes('get all breeder') || messageLower.includes('all breeder')) {
      results = sampleData;
      responseText = "I've retrieved all breeders with their name, phone, and location information. Here are the results:";
    } 
    else if (messageLower.includes('page 1 until 3') || messageLower.includes('from page 1')) {
      // Simulate pagination data (first 6 items representing pages 1-3)
      results = sampleData.slice(0, 6);
      responseText = "I've retrieved breeders from pages 1 to 3. Here are the results:";
    }
    else if (messageLower.includes('filter') && messageLower.includes('mott nd')) {
      results = sampleData.filter(item => item.location === 'MOTT ND');
      responseText = "I've filtered the data to show only breeders from MOTT ND. Here are the results:";
    }
    else {
      responseText = "I understand you want information about breeders. Could you specify what data you need? For example, you can ask for all breeders' information or filter by specific criteria.";
    }
    
    return { text: responseText, results };
  }
}

export default new AIService();