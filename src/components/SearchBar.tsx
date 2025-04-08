
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
      <Input 
        type="text"
        placeholder="Search your stash..."
        className="pl-10 py-6 text-lg bg-gray-100 border-none rounded-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
