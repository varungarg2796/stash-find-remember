import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageSquareMore } from "lucide-react";
import { useItems } from "@/context/ItemsContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const AskStasher = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items } = useItems();

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Here we simulate an API call to a language model
      // In a real implementation, this would be a call to OpenAI or a similar service
      setTimeout(() => {
        // Simple keyword-based responses for demonstration
        const lowerQuery = query.toLowerCase();
        let answer = "";
        
        if (lowerQuery.includes("cookbook") && lowerQuery.includes("where")) {
          const cookbook = items.find(item => 
            item.name.toLowerCase().includes("cookbook")
          );
          
          answer = cookbook 
            ? `Your cookbook is kept in the ${cookbook.location}.` 
            : "I couldn't find any cookbook in your stash.";
        } 
        else if (lowerQuery.includes("gift") && lowerQuery.includes("aunt sarah")) {
          const gifts = items.filter(item => 
            item.tags.some(tag => tag.toLowerCase().includes("gift")) &&
            (item.description?.toLowerCase().includes("aunt sarah") || 
             item.description?.toLowerCase().includes("from sarah"))
          );
          
          if (gifts.length > 0) {
            answer = `You received ${gifts.length} gift(s) from Aunt Sarah: ${gifts.map(g => g.name).join(", ")}.`;
          } else {
            answer = "I couldn't find any gifts specifically from Aunt Sarah in your stash.";
          }
        }
        else if (lowerQuery.includes("where") && lowerQuery.includes("my")) {
          // Try to extract the item name from the query
          const words = lowerQuery.split(" ");
          const myIndex = words.indexOf("my");
          if (myIndex !== -1 && myIndex < words.length - 1) {
            const possibleItem = words[myIndex + 1].replace(/[?.,]/g, "");
            const foundItem = items.find(item => 
              item.name.toLowerCase().includes(possibleItem)
            );
            
            if (foundItem) {
              answer = `Your ${foundItem.name} is kept in the ${foundItem.location || "unknown location"}.`;
            } else {
              answer = `I couldn't find any item matching '${possibleItem}' in your stash.`;
            }
          } else {
            answer = "Could you specify which item you're looking for?";
          }
        }
        else {
          answer = "I'm not sure how to answer that question. Try asking about where items are located or what gifts you've received from specific people.";
        }
        
        setResponse(answer);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching response:", error);
      toast.error("Failed to get a response. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Ask Stasher</h1>
        <p className="text-gray-500 mt-2">
          Ask questions about your stashed items and get smart answers
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="min-h-[300px] max-h-[500px] overflow-y-auto mb-4">
          {response ? (
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                  <p className="text-gray-800">{query}</p>
                </div>
              </div>
              
              <div className="flex items-start justify-end">
                <div className="bg-primary/10 rounded-lg p-4 max-w-[80%]">
                  <p className="text-gray-800">{response}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center flex-col">
              <MessageSquareMore size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">
                Ask me anything about your stashed items!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                For example: "Where is my cookbook kept?" or "What gifts did I get from Aunt Sarah?"
              </p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading ? "Thinking..." : <Send size={18} />}
          </Button>
        </form>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="font-semibold text-gray-700">Sample questions</h3>
        <ul className="mt-2 space-y-2">
          <li>
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => setQuery("Where is my cookbook kept?")}
            >
              Where is my cookbook kept?
            </Button>
          </li>
          <li>
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => setQuery("What gifts did I get from Aunt Sarah?")}
            >
              What gifts did I get from Aunt Sarah?
            </Button>
          </li>
          <li>
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => setQuery("Where are my wine glasses?")}
            >
              Where are my wine glasses?
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AskStasher;
