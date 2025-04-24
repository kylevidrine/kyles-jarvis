
import React from 'react';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, timestamp }) => {
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div 
      className={cn(
        "mb-4 max-w-[80%] animate-fade-in", 
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div 
        className={cn(
          "px-4 py-3 rounded-2xl glassmorphism",
          isUser 
            ? "bg-primary/20 border-primary/30 text-right" 
            : "border-white/10"
        )}
      >
        <p className="text-sm md:text-base">{content}</p>
        <div 
          className={cn(
            "text-xs mt-1 opacity-60",
            isUser ? "text-right" : "text-left"
          )}
        >
          {isUser ? "You" : "Jarvis"} · {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
