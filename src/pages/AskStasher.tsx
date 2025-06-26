import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, MessageSquareMore, User, Bot, MapPin, Package, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAskStasherMutation, useQueryStatusQuery, AiResponse, FoundItem } from '@/hooks/useAiQuery';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  items?: FoundItem[];
  responseTime?: number;
}

const AskStasher = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const askMutation = useAskStasherMutation();
  const { data: queryStatus, refetch: refetchStatus } = useQueryStatusQuery();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  // Refetch status when user changes
  useEffect(() => {
    if (user) {
      refetchStatus();
    }
  }, [user, refetchStatus]);

  const formatResponseTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getTimeUntilReset = (resetTime?: string): string => {
    if (!resetTime) return '';
    const now = new Date();
    const reset = new Date(resetTime);
    const diffMs = reset.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery || askMutation.isPending || (queryStatus?.remaining || 0) <= 0) return;

    // Add user's question to chat history
    const userMessage: ChatMessage = { role: 'user', content: trimmedQuery };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');

    // Call the mutation
    askMutation.mutate(trimmedQuery, {
      onSuccess: (data: AiResponse) => {
        // Add bot's response to chat history
        const botMessage: ChatMessage = {
          role: 'bot', 
          content: data.answer, 
          items: data.foundItems || [],
          responseTime: data.responseTime
        };
        setChatHistory(prev => [...prev, botMessage]);
        
        // Refetch query status to get updated counts
        refetchStatus();
      },
      onError: () => {
        // Refetch status on error (might be quota exceeded)
        refetchStatus();
      }
    });
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/items/${itemId}`);
  };

  if (!user) return null;

  const isQuotaExhausted = (queryStatus?.remaining || 0) <= 0;

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6 flex flex-col h-[calc(100vh-4.5rem)]">
      <div className="flex-shrink-0">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-gray-100">
          <ArrowLeft className="mr-2" size={18} /> Back
        </Button>
        
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-purple-500" size={24} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ask Stasher
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">Ask questions about your items to get smart answers.</p>
          
          {/* Query Status */}
          <div className="mt-4 flex items-center justify-center gap-4">
            {queryStatus && (
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                queryStatus.remaining > 5 ? "bg-green-100 text-green-700" :
                queryStatus.remaining > 2 ? "bg-yellow-100 text-yellow-700" :
                queryStatus.remaining > 0 ? "bg-orange-100 text-orange-700" :
                "bg-red-100 text-red-700"
              )}>
                {queryStatus.remaining}/{queryStatus.total} queries left for today
              </div>
            )}
            
            {isQuotaExhausted && queryStatus?.resetTime && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                Resets in {getTimeUntilReset(queryStatus.resetTime)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {chatHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col text-center py-12">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-4 rounded-full mb-4">
                  <MessageSquareMore size={48} className="text-purple-600" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">Ask me anything about your stash!</p>
                <div className="space-y-1 text-gray-500">
                  <p className="text-sm">• "Where are my hiking boots?"</p>
                  <p className="text-sm">• "Show me expired items"</p>
                  <p className="text-sm">• "What's in my kitchen?"</p>
                </div>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                  {message.role === 'bot' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-lg">
                      <Bot size={20} />
                    </div>
                  )}
                  
                  <div className="max-w-[80%]">
                    <div className={cn(
                      "rounded-xl p-4 shadow-sm",
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                        : 'bg-white border border-gray-200'
                    )}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    
                    {/* Display found items */}
                    {message.items && message.items.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                          <Sparkles size={16} />
                          Found it instantly! • {message.responseTime ? formatResponseTime(message.responseTime) : '0.2s'}
                        </div>
                        {message.items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-purple-300 transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-purple-100 group-hover:to-purple-200 transition-colors overflow-hidden">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Package size={20} className="text-gray-600 group-hover:text-purple-600" />
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 group-hover:text-purple-700">
                                  {item.name}
                                </h4>
                                
                                {item.location && (
                                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                    <MapPin size={14} />
                                    {item.location}
                                  </div>
                                )}
                                
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {item.tags.length > 3 && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        +{item.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-white flex items-center justify-center shadow-lg">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {askMutation.isPending && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-lg">
                  <Bot size={20} />
                </div>
                <div className="rounded-xl p-4 bg-white border border-gray-200 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-400"></span>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="flex space-x-3 mt-6 border-t border-gray-200 pt-6">
          <Input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder={isQuotaExhausted ? "Daily limit reached" : "Ask a question..."} 
            disabled={askMutation.isPending || isQuotaExhausted} 
            className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500" 
          />
          <Button 
            type="submit" 
            disabled={askMutation.isPending || !query.trim() || isQuotaExhausted}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6"
          >
            {askMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Thinking...
              </>
            ) : (
              <Send size={18} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AskStasher;