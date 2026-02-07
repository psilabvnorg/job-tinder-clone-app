import { useState } from 'react';
import { stories } from '@/data/mockData';
import type { User } from '@/types';
import { Plus } from 'lucide-react';

interface StoriesProps {
  onUserClick: (user: User) => void;
}

export function Stories({ onUserClick }: StoriesProps) {
  const [activeStory, setActiveStory] = useState<string | null>(null);

  const handleStoryClick = (storyId: string, user: User) => {
    setActiveStory(storyId);
    setTimeout(() => {
      setActiveStory(null);
      onUserClick(user);
    }, 300);
  };

  return (
    <div className="mb-8">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* Add Story Button */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <button className="w-16 h-16 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center bg-white hover:bg-purple-50 transition-colors">
            <Plus className="w-6 h-6 text-purple-600" />
          </button>
          <span className="text-xs text-gray-600 font-medium">Add</span>
        </div>

        {/* Story Items */}
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(story.id, story.user)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group"
          >
            <div 
              className={`relative w-16 h-16 rounded-full p-[3px] transition-transform ${
                activeStory === story.id ? 'scale-95' : ''
              } ${
                story.hasUnseen 
                  ? 'bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500' 
                  : 'bg-gray-200'
              }`}
            >
              <img
                src={story.image}
                alt={story.user.name}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
              {story.hasUnseen && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-purple-600 rounded-full border-2 border-white" />
              )}
            </div>
            <span className={`text-xs font-medium truncate max-w-[64px] ${
              story.hasUnseen ? 'text-[#0B0D10]' : 'text-gray-500'
            }`}>
              {story.user.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
