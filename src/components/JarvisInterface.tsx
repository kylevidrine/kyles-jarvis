
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import VoiceRecorder from './VoiceRecorder';
import { useToast } from '@/hooks/use-toast';

interface Message extends ChatMessageProps {}

const JarvisInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello, I'm Jarvis. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto scroll to the bottom of the chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTranscription = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      content: text,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Send to webhook and get response
    try {
      await sendToWebhook(text);
    } catch (error) {
      console.error('Error communicating with webhook:', error);
      toast({
        title: "Communication Error",
        description: "Failed to connect with Jarvis. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const sendToWebhook = async (text: string) => {
    // Simulate webhook communication
    // In a real implementation, you would send this to your actual webhook endpoint
    
    setTimeout(() => {
      // Mock responses based on user input
      let response = "I'm sorry, I don't understand. Could you rephrase that?";
      
      if (text.toLowerCase().includes("weather")) {
        response = "Currently, it's 72°F and sunny outside. Perfect day for outdoor activities.";
      } else if (text.toLowerCase().includes("tech") || text.toLowerCase().includes("news")) {
        response = "The latest tech news includes advancements in AI technology and quantum computing breakthroughs.";
      } else if (text.toLowerCase().includes("help") || text.toLowerCase().includes("project")) {
        response = "I can assist with information retrieval, scheduling, reminders, and answering various questions. How can I help with your project specifically?";
      } else if (text.toLowerCase().includes("capabilities")) {
        response = "I can process voice commands, answer questions, provide recommendations, and assist with various tasks. My capabilities continue to expand with updates.";
      } else if (text.toLowerCase().includes("music") || text.toLowerCase().includes("play")) {
        response = "I've started playing your favorite playlist. Enjoy the music!";
      }
      
      const jarvisMessage: Message = {
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, jarvisMessage]);
      setIsProcessing(false);
      
      // This is where you would integrate ElevenLabs to speak the response
      // For example: speakWithElevenLabs(response);
    }, 2000); // Simulate network delay
  };

  // This function would be used with an actual ElevenLabs integration
  const speakWithElevenLabs = (text: string) => {
    // ElevenLabs API integration would go here
    console.log("Speaking with ElevenLabs:", text);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto px-4">
      <header className="py-6 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          J.A.R.V.I.S. INTERFACE
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Just A Rather Very Intelligent System
        </p>
      </header>
      
      <main className="flex-1 flex flex-col">
        <div 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto chat-window scrollbar-none px-2 py-4"
        >
          <div className="space-y-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isProcessing && (
              <div className="flex items-center space-x-2 ml-4 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-white/10 py-4 glassmorphism backdrop-blur-md bg-opacity-30">
          <VoiceRecorder 
            onTranscription={handleTranscription} 
            isProcessing={isProcessing} 
          />
          <p className="text-center text-xs text-muted-foreground mt-2">
            {isProcessing 
              ? "Processing your request..." 
              : "Tap the microphone and speak to Jarvis"}
          </p>
        </div>
      </main>
    </div>
  );
};

export default JarvisInterface;
