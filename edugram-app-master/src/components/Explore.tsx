import { topics, users } from '@/data/mockData';
import type { Category, User } from '@/types';
import { TrendingUp, Users, ArrowRight } from 'lucide-react';

interface ExploreProps {
  onTopicClick: (category: Category) => void;
  onUserClick: (user: User) => void;
}

export function Explore({ onTopicClick, onUserClick }: ExploreProps) {
  const trendingInstructors = users.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0B0D10] mb-2">Explore</h1>
        <p className="text-gray-500">Discover new topics and instructors</p>
      </div>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0B0D10] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Trending Now
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.slice(0, 4).map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicClick(topic.category)}
              className="group relative overflow-hidden rounded-2xl aspect-[16/10] bg-gray-100"
            >
              <img
                src={topic.image}
                alt={topic.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="text-white font-semibold text-lg mb-1">{topic.name}</h3>
                <p className="text-white/80 text-sm">{topic.postCount.toLocaleString()} posts</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* All Topics */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0B0D10]">All Topics</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicClick(topic.category)}
              className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={topic.image}
                  alt={topic.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="font-semibold text-[#0B0D10] mb-1">{topic.name}</h3>
                <p className="text-sm text-gray-500">{topic.followerCount.toLocaleString()} followers</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Top Instructors */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0B0D10] flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Top Instructors
          </h2>
          <button className="text-sm text-purple-600 hover:underline flex items-center gap-1">
            See all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trendingInstructors.map((user) => (
            <button
              key={user.id}
              onClick={() => onUserClick(user)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all text-left"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#0B0D10] truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.username}</p>
                <p className="text-sm text-purple-600 mt-1">{user.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#0B0D10]">
                  {(user.followers / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-500">followers</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Daily Challenge Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Daily Learning Challenge</h2>
            <p className="text-white/80">Complete 3 lessons today and earn a streak badge!</p>
          </div>
          <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors whitespace-nowrap">
            Start Challenge
          </button>
        </div>
      </section>
    </div>
  );
}
