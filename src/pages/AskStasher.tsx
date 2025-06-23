import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, MessageSquareMore, User, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAskStasherMutation } from '@/hooks/useAiQuery';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

const AskStasher = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const askMutation = useAskStasherMutation();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery || askMutation.isPending) return;

    // Add user's question to chat history
    const userMessage: ChatMessage = { role: 'user', content: trimmedQuery };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');

    // Call the mutation
    askMutation.mutate(trimmedQuery, {
      onSuccess: (data) => {
        // Add bot's response to chat history
        const botMessage: ChatMessage = { role: 'bot', content: data.answer };
        setChatHistory(prev => [...prev, botMessage]);
      },
    });
  };

  if (!user) return null; // Render nothing during redirect

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6 flex flex-col h-[calc(100vh-4.5rem)]">
      <div className="flex-shrink-0">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2" size={18} /> Back
        </Button>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Ask Stasher</h1>
          <p className="text-muted-foreground mt-2">Ask questions about your items to get smart answers.</p>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-lg shadow-md p-4 flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {chatHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col text-center">
                <MessageSquareMore size={48} className="text-gray-300 mb-4" />
                <p className="text-muted-foreground">Ask me anything about your stash!</p>
                <p className="text-gray-400 text-sm mt-2">e.g., "Where are my hiking boots?"</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                  {message.role === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Bot size={18} /></div>}
                  <div className={cn("rounded-lg p-3 max-w-[80%]", message.role === 'user' ? 'bg-muted' : 'bg-primary/10')}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center"><User size={18} /></div>}
                </div>
              ))
            )}
             {askMutation.isPending && (
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Bot size={18} /></div>
                    <div className="rounded-lg p-3 bg-primary/10 flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-400"></span>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="flex space-x-2 mt-4 border-t pt-4">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask a question..." disabled={askMutation.isPending} className="flex-1" />
          <Button type="submit" disabled={askMutation.isPending || !query.trim()}>
            {askMutation.isPending ? "Thinking..." : <Send size={18} />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AskStasher;