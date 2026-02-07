import { useState, useRef, useEffect } from 'react';
import type { User } from '@/types';
import { sendMessageToLLM, type ChatMessage } from '@/services/llmService';
import { ArrowLeft, Phone, Video, Info, Send, Image as ImageIcon, Mic, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatProps {
  user: User;
  onBack: () => void;
}

export function Chat({ user, onBack }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm ${user.name}. How can I help you learn today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessageToLLM(userMessage.content, user, messages);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white animate-in fade-in duration-300">
      {/* Chat Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0B0D10]" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-[#0B0D10]">{user.name}</h2>
              <p className="text-xs text-green-600">Active now</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-[#0B0D10]" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-[#0B0D10]" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Info className="w-5 h-5 text-[#0B0D10]" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-3">
            {/* Date Divider */}
            <div className="flex items-center justify-center">
              <span className="text-xs text-gray-400 bg-[#FAFAFA] px-3 py-1">
                {date === new Date().toLocaleDateString() ? 'Today' : date}
              </span>
            </div>

            {dateMessages.map((message, index) => {
              const isAssistant = message.role === 'assistant';
              const showAvatar = isAssistant && (
                index === 0 || dateMessages[index - 1]?.role !== 'assistant'
              );

              return (
                <div
                  key={message.id}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-2 max-w-[75%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Avatar */}
                    {isAssistant && showAvatar && (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1"
                      />
                    )}
                    {isAssistant && !showAvatar && (
                      <div className="w-7 flex-shrink-0" />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isAssistant
                          ? 'bg-white border border-[#E5E7EB] text-[#0B0D10] rounded-tl-md'
                          : 'bg-purple-600 text-white rounded-tr-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <span
                        className={`text-[10px] mt-1 block ${
                          isAssistant ? 'text-gray-400' : 'text-purple-200'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[75%]">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1"
              />
              <div className="px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-[#E5E7EB] bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder={`Message ${user.name}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full bg-gray-100 border-0 rounded-full px-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Smile className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {inputMessage.trim() ? (
            <Button
              type="submit"
              disabled={isLoading}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          ) : (
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Mic className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
