
import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioForTranscription(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Access Error",
        description: "Please ensure microphone access is allowed in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioForTranscription = async (audioBlob: Blob) => {
    try {
      // Simulate transcription for this demo
      // In a real implementation, you would send this to a transcription service
      
      // Mock transcription response
      setTimeout(() => {
        const mockTranscriptions = [
          "What's the weather like today?",
          "Tell me about the latest tech news",
          "How can you help me with my project?",
          "What are your capabilities?",
          "Play some music for me"
        ];
        
        const randomIndex = Math.floor(Math.random() * mockTranscriptions.length);
        const transcribedText = mockTranscriptions[randomIndex];
        
        onTranscription(transcribedText);
      }, 1000); // Simulate network delay
    } catch (error) {
      console.error('Error with transcription:', error);
      toast({
        title: "Transcription Error",
        description: "There was an issue processing your audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center my-4">
      <button
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500/20 border-red-500/50' 
            : isProcessing 
              ? 'bg-yellow-500/20 border-yellow-500/50 opacity-70 cursor-not-allowed' 
              : 'bg-primary/20 border-primary/50 hover:bg-primary/30'
        } border glassmorphism ${
          isRecording ? 'pulse-glow' : ''
        }`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <Square className="h-6 w-6 text-red-400" />
        ) : (
          <Mic className={`h-6 w-6 ${isProcessing ? 'text-yellow-400 animate-spin-slow' : 'text-primary'}`} />
        )}
      </button>
    </div>
  );
};

export default VoiceRecorder;
