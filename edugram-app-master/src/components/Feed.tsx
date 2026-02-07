import type { Category } from '@/types';
import { posts as allPosts, practiceQuestions } from '@/data/mockData';
import { Post } from './Post';
import type { User } from '@/types';
import { PracticeCarousel } from './PracticeCarousel';

interface FeedProps {
  category: Category;
  onUserClick: (user: User) => void;
}

export function Feed({ category, onUserClick }: FeedProps) {
  const filteredPosts = category === 'All' 
    ? allPosts 
    : allPosts.filter(post => post.category === category);

  const focusSteps = [
    {
      title: 'Warm-up recap',
      description: 'Review yesterday\'s notes and save 1 key insight.',
      duration: '5 min',
    },
    {
      title: 'Deep dive',
      description: 'Watch a focused lesson and write a 3-line summary.',
      duration: '15 min',
    },
    {
      title: 'Practice sprint',
      description: 'Apply the idea in a quick quiz or exercise.',
      duration: '10 min',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Focus Sprint */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Focus Sprint</p>
            <h2 className="text-lg font-semibold text-[#0B0D10]">25-minute learning plan</h2>
            <p className="text-sm text-gray-500">Stay consistent with a guided micro-session.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">Today\'s goal</p>
              <p className="text-sm font-semibold text-[#0B0D10]">1 lesson + 1 quiz</p>
            </div>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">80% ready</span>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {focusSteps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-3 rounded-xl border border-[#F2F3F5] bg-[#F9FAFB] p-3">
              <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-purple-600 shadow-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#0B0D10]">{step.title}</p>
                  <span className="text-xs text-gray-400">{step.duration}</span>
                </div>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 w-3/5 rounded-full bg-purple-600" />
            </div>
            <p className="mt-2 text-xs text-gray-400">3 of 5 weekly sessions completed</p>
          </div>
          <button className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
            Start sprint
          </button>
        </div>
      </section>

      {/* Category Header */}
      {category !== 'All' && (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-lg">{getCategoryEmoji(category)}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#0B0D10]">{category}</h2>
            <p className="text-sm text-gray-500">{filteredPosts.length} posts</p>
          </div>
        </div>
      )}

      {/* Posts */}
      {filteredPosts.map((post) => (
        <Post 
          key={post.id} 
          post={post} 
          onUserClick={onUserClick}
        />
      ))}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-3xl">📚</span>
          </div>
          <h3 className="text-lg font-medium text-[#0B0D10] mb-2">No posts yet</h3>
          <p className="text-sm text-gray-500">Be the first to share in this category!</p>
        </div>
      )}

      {/* Load More */}
      {filteredPosts.length > 0 && (
        <div className="text-center py-8">
          <button className="px-6 py-2.5 bg-white border border-[#E5E7EB] rounded-full text-sm font-medium text-[#0B0D10] hover:bg-gray-50 transition-colors">
            Load more posts
          </button>
        </div>
      )}
    </div>
  );
}

function getCategoryEmoji(category: Category): string {
  const emojis: Record<string, string> = {
    'IELTS': '📖',
    'Marketing': '📈',
    'Finance': '💰',
    'MBA': '🎓',
    'Design': '🎨',
    'Leadership': '💡',
  };
  return emojis[category] || '📚';
}
