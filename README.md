# Web Scraping Chat Interface

A modern web application that allows users to chat with an AI assistant to extract and analyze data from websites. This project combines natural language processing with web scraping capabilities to provide an intuitive interface for data extraction.

![Web Scraping Chat Interface](https://i.imgur.com/example-screenshot.png)

## Features

- **Conversational Interface**: Chat with an AI to request specific data from websites
- **URL Input**: Easily set the target website for scraping
- **Structured Results**: View extracted data in a clean, tabular format
- **Export Functionality**: Download scraped data as JSON
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Context API
- **Data Handling**: React Query
- **Styling**: Tailwind CSS with custom animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-scraping-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## API Documentation

### AI Service API

The application uses a simulated AI service for demonstration purposes. In a production environment, this would connect to a real backend API.

#### `AIService.createSession()`

Creates a new chat session with the AI.

- **Returns**: `string` - A unique session ID

#### `AIService.getSession(sessionId: string)`

Retrieves a session by its ID.

- **Parameters**:
  - `sessionId`: The unique identifier for the session
- **Returns**: `ChatSession | undefined` - The session object if found

#### `AIService.processMessage(sessionId: string, userMessage: string, url?: string)`

Processes a user message and returns an AI response.

- **Parameters**:
  - `sessionId`: The unique identifier for the session
  - `userMessage`: The user's message text
  - `url` (optional): The URL to scrape
- **Returns**: `Promise<ApiResponse>` - The AI's response with any scraped data

### Scraper Service API

#### `ScraperService.scrapeUrl(url: string, pages?: number)`

Scrapes data from a specified URL.

- **Parameters**:
  - `url`: The URL to scrape
  - `pages` (optional): Number of pages to scrape
- **Returns**: `Promise<ScrapingResult[]>` - Array of scraped data objects

#### `ScraperService.isValidUrl(url: string)`

Validates if a string is a properly formatted URL.

- **Parameters**:
  - `url`: The URL string to validate
- **Returns**: `boolean` - Whether the URL is valid

## Data Types

### Message

```typescript
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}
```

### ScrapingResult

```typescript
interface ScrapingResult {
  [key: string]: string | number | boolean | null;
}
```

### ApiResponse

```typescript
interface ApiResponse {
  text: string;
  results: ScrapingResult[];
  sessionId: string;
  [key: string]: any;
}
```

### ChatSession

```typescript
interface ChatSession {
  id: string;
  messages: Message[];
  results: ScrapingResult[];
  currentUrl?: string;
  createdAt?: number;
}
```

## Usage Examples

### Basic Usage

1. Enter a URL in the URL input field and click "Set URL"
2. Ask the AI to extract specific data, for example:
   - "Get all breeders from this website"
   - "Extract data from pages 1 to 3"
   - "Filter results to only show breeders from MOTT ND"

### Advanced Queries

The AI can handle more complex queries such as:
- "Find all breeders in North Dakota and sort them by name"
- "Extract contact information for breeders in Nebraska"
- "Compare breeders across different states"

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by modifying the `tailwind.config.ts` file.

### Adding New Features

To extend the application with new features:

1. Add new components in the `src/components` directory
2. Update the services in `src/services` to handle new functionality
3. Modify the types in `src/types` as needed

## Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### Deploying to a Server

The built application is a static site that can be deployed to any web server or hosting service that supports static sites (Netlify, Vercel, GitHub Pages, etc.).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast development experience