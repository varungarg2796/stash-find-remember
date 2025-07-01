import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, DollarSign, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext'; // We'll get user's preferences from here
import { useState } from 'react';
import { TagLocationManager } from '@/components/TagLocationManager';

interface FilterTabsProps {
  onFilterChange: (filter: string, subFilter?: string) => void;
  activeFilter: string;
  activeSubFilter?: string;
}

const FilterTabs = ({ onFilterChange, activeFilter, activeSubFilter }: FilterTabsProps) => {
  const { user } = useAuth(); // Get user to access their defined tags and locations
  const isMobile = useIsMobile();
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [managerTab, setManagerTab] = useState<'tags' | 'locations'>('tags');
  
  // These now come from the user's profile data
  const uniqueTags = user?.tags.map(t => t.name).sort() || [];
  const uniqueLocations = user?.locations.map(l => l.name).sort() || [];

  const handleFilterClick = (filterId: string) => {
    if (filterId !== activeFilter || activeSubFilter) {
      onFilterChange(filterId);
    }
  };

  const handleSubFilterClick = (subFilter: string, parentFilter: string) => {
    onFilterChange(parentFilter, subFilter);
  };

  const handleManageTags = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setManagerTab('tags');
    setIsManagerOpen(true);
  };

  const handleManageLocations = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setManagerTab('locations');
    setIsManagerOpen(true);
  };

  const filters = [
    { id: 'all', label: 'All Items', mobileLabel: 'All' },
    { id: 'tags', label: 'By Tag', mobileLabel: 'Tags', subItems: uniqueTags },
    { id: 'location', label: 'By Location', mobileLabel: 'Loc', subItems: uniqueLocations },
    { id: 'price', label: 'By Price', mobileLabel: 'Price', icon: <DollarSign size={isMobile ? 14 : 16} className="mr-1" />,
      subItems: [
        { id: 'priceless', label: 'Priceless Items' },
        { id: 'with-price', label: 'Items with Price' },
        { id: 'no-price', label: 'Items without Price' },
      ]
    },
  ];

  return (
    <>
      <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            {filter.subItems ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors focus:outline-none flex items-center ${activeFilter === filter.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  {filter.icon} {isMobile ? filter.mobileLabel : filter.label} <ChevronDown size={16} className="ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {/* Manage button for tags and locations */}
                  {(filter.id === 'tags' || filter.id === 'location') && (
                    <>
                      <DropdownMenuItem
                        onClick={filter.id === 'tags' ? handleManageTags : handleManageLocations}
                        className="text-blue-600 font-medium border-b"
                      >
                        <Settings size={14} className="mr-2" />
                        Manage {filter.id === 'tags' ? 'Tags' : 'Locations'}
                      </DropdownMenuItem>
                    </>
                  )}
                  {filter.subItems.map((subItem: string | { id: string; label: string }) => (
                    <DropdownMenuItem
                      key={typeof subItem === 'string' ? subItem : subItem.id}
                      onClick={() => handleSubFilterClick(typeof subItem === 'string' ? subItem : subItem.id, filter.id)}
                      className={activeSubFilter === (typeof subItem === 'string' ? subItem : subItem.id) ? 'bg-muted' : ''}
                    >
                      {typeof subItem === 'string' ? subItem : subItem.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => handleFilterClick(filter.id)}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors focus:outline-none ${activeFilter === filter.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
              >
                {isMobile ? filter.mobileLabel : filter.label}
              </button>
            )}
          </div>
        ))}
      </div>

      <TagLocationManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        initialTab={managerTab}
      />
    </>
  );
};

export default FilterTabs;