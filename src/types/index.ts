
export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ScrapingResult {
  [key: string]: string | number | boolean | null;
}

export interface ApiResponse {
  text: string;
  results: ScrapingResult[];
  sessionId: string;
  [key: string]: any;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  results: ScrapingResult[];
  currentUrl?: string;
  createdAt?: number;
}
