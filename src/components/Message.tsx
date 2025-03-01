
import React from 'react';
import { Message as MessageType } from '@/types';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[80%] px-4 py-3 rounded-2xl",
          isUser 
            ? "bg-primary text-primary-foreground mr-2" 
            : "glassmorphism ml-2"
        )}
      >
        {message.isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:0.4s]" />
          </div>
        ) : (
          <div className="text-balance">{message.content}</div>
        )}
        <div 
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default Message;
