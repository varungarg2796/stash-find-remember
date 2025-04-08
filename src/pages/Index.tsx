
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import FilterTabs from "@/components/FilterTabs";
import ItemCard from "@/components/ItemCard";
import AddItemButton from "@/components/AddItemButton";
import { toast } from "sonner";

// Mock data for our items
const MOCK_ITEMS = [
  {
    id: "1",
    name: "Sweater",
    imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
    tags: ["Clothing", "Gift"],
    quantity: 1,
    location: "Wardrobe"
  },
  {
    id: "2",
    name: "Cookbook",
    imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
    tags: ["Books", "Christmas"],
    quantity: 1,
    location: "Bookshelf"
  },
  {
    id: "3",
    name: "Wine Glasses",
    imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
    tags: ["Glassware", "Set"],
    quantity: 2,
    location: "Kitchen"
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    imageUrl: "/lovable-uploads/f602ee41-f8c2-4f17-b088-c26c4844f394.png",
    tags: ["Electronics", "Prize"],
    quantity: 1,
    location: "Drawer"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState(MOCK_ITEMS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleUseItem = (id: string) => {
    // In a real app, we would update the database
    // For now, we'll just show a toast
    toast.success("Item marked as used");
  };

  const handleGiftItem = (id: string) => {
    // In a real app, we would update the database
    // For now, we'll just show a toast
    toast.success("Item marked for gifting");
  };

  const handleAddItem = () => {
    // In a real app, we would navigate to an add item page
    // For now, we'll just show a toast
    toast.info("Add item functionality coming soon!");
  };

  // Filter items based on search query and active filter
  const filteredItems = items.filter(item => {
    // First apply search filter
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Then apply category filter
    switch (activeFilter) {
      case "tags":
        return item.tags.length > 0;
      case "location":
        return !!item.location;
      case "unused":
        return true; // In a real app, we would check usage history
      case "all":
      default:
        return true;
    }
  });

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="mb-8">
        <FilterTabs onFilterChange={handleFilterChange} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map(item => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            tags={item.tags}
            quantity={item.quantity}
            onUse={handleUseItem}
            onGift={handleGiftItem}
          />
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found. Add some items to your stash!</p>
        </div>
      )}
      
      <AddItemButton onClick={handleAddItem} />
    </div>
  );
};

export default Index;
