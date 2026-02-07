import type { Category } from '@/types';
import { Home, Compass, BookOpen, TrendingUp, Users, Lightbulb, Palette, BarChart3, GraduationCap } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  onNavigateFeed: () => void;
  onNavigateExplore: () => void;
}

const categories: { name: Category; icon: React.ElementType; color: string }[] = [
  { name: 'All', icon: Home, color: 'text-purple-600' },
  { name: 'IELTS', icon: BookOpen, color: 'text-blue-500' },
  { name: 'Marketing', icon: TrendingUp, color: 'text-green-500' },
  { name: 'Finance', icon: BarChart3, color: 'text-amber-500' },
  { name: 'MBA', icon: GraduationCap, color: 'text-red-500' },
  { name: 'Design', icon: Palette, color: 'text-pink-500' },
  { name: 'Leadership', icon: Lightbulb, color: 'text-indigo-500' },
];

export function Sidebar({ 
  currentView, 
  selectedCategory, 
  onCategoryChange,
  onNavigateFeed,
  onNavigateExplore 
}: SidebarProps) {
  const handleCategoryClick = (category: Category) => {
    onCategoryChange(category);
    onNavigateFeed();
  };

  return (
    <div className="p-4 space-y-2">
      {/* Main Navigation */}
      <div className="space-y-1">
        <button
          onClick={onNavigateFeed}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            currentView === 'feed' && selectedCategory === 'All'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
              : 'text-[#0B0D10] hover:bg-white'
          }`}
        >
          <Home className="w-5 h-5" />
          Home
        </button>
        
        <button
          onClick={onNavigateExplore}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            currentView === 'explore'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
              : 'text-[#0B0D10] hover:bg-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          Explore
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E5E7EB] my-4" />

      {/* Categories */}
      <div>
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Categories
        </p>
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.name && currentView === 'feed';
            
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#0B0D10] shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-[#0B0D10]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? category.color : 'text-gray-400'}`} />
                {category.name}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E5E7EB] my-4" />

      {/* Community */}
      <div>
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Community
        </p>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-white hover:text-[#0B0D10] transition-all">
          <Users className="w-4 h-4 text-gray-400" />
          Study Groups
        </button>
      </div>
    </div>
  );
}
