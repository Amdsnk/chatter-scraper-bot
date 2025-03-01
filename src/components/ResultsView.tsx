import React, { useState } from 'react';
import { ScrapingResult } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DownloadIcon, 
  FilterIcon, 
  SearchIcon, 
  XIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsViewProps {
  results: ScrapingResult[];
}

const ResultsView: React.FC<ResultsViewProps> = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // No results to display
  if (!results.length) {
    return null;
  }
  
  // Get all columns from the results
  const columns = Object.keys(results[0]);
  
  // Filter results based on search term
  const filteredResults = results.filter(result => 
    Object.values(result).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Download results as JSON
  const downloadResults = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "scraping_results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <div className={cn(
      "w-full transition-all duration-500 ease-in-out overflow-hidden rounded-lg border border-border backdrop-blur-xs",
      isExpanded ? "max-h-[600px]" : "max-h-[300px]"
    )}>
      <div className="p-4 bg-card/50 backdrop-blur-sm border-b flex flex-col sm:flex-row justify-between items-center gap-2">
        <h3 className="text-lg font-medium">
          Results ({filteredResults.length})
        </h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-[200px]">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search results"
              className="pl-8 h-9 text-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadResults}
            className="h-9"
          >
            <DownloadIcon className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-9"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      
      <div className="overflow-auto scrollbar-hidden max-h-[calc(100%-60px)]">
        <Table>
          <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="text-left capitalize">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column}`} className="py-2">
                      {result[column] !== null ? String(result[column]) : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4 text-muted-foreground">
                  No results found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResultsView;