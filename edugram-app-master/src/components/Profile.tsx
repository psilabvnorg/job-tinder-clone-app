import { useState } from 'react';
import type { User, Post as PostType } from '@/types';
import { Post } from './Post';
import { formatNumber } from '@/data/mockData';
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, Grid3X3, Bookmark, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileProps {
  user: User;
  posts: PostType[];
  onBack: () => void;
  onMessageClick: (user: User) => void;
}

type TabType = 'posts' | 'saved' | 'tagged';

export function Profile({ user, posts, onBack, onMessageClick }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0B0D10] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to feed
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-purple-100"
              />
              <span className="absolute bottom-1 right-1 w-6 h-6 bg-purple-600 rounded-full border-4 border-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold text-[#0B0D10]">{user.name}</h1>
              <div className="flex gap-2 justify-center md:justify-start">
                <Button
                  onClick={handleFollow}
                  className={`rounded-full px-6 ${
                    isFollowing 
                      ? 'bg-gray-100 text-[#0B0D10] hover:bg-gray-200' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full px-6 border-[#E5E7EB]"
                  onClick={() => onMessageClick(user)}
                >
                  Message
                </Button>
              </div>
            </div>

            <p className="text-gray-500 mb-1">{user.username}</p>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-6 mb-4">
              <div className="text-center md:text-left">
                <span className="font-bold text-[#0B0D10]">{formatNumber(user.posts)}</span>
                <span className="text-gray-500 text-sm ml-1">posts</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-bold text-[#0B0D10]">{formatNumber(user.followers)}</span>
                <span className="text-gray-500 text-sm ml-1">followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-bold text-[#0B0D10]">{formatNumber(user.following)}</span>
                <span className="text-gray-500 text-sm ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-[#0B0D10] mb-3">{user.bio}</p>

            {/* Meta */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </span>
              <span className="flex items-center gap-1 text-purple-600 hover:underline cursor-pointer">
                <LinkIcon className="w-4 h-4" />
                edugram.com/{user.username}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined March 2024
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB] mb-6">
        <div className="flex justify-center gap-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'posts' 
                ? 'text-[#0B0D10] border-b-2 border-purple-600' 
                : 'text-gray-500 hover:text-[#0B0D10]'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'saved' 
                ? 'text-[#0B0D10] border-b-2 border-purple-600' 
                : 'text-gray-500 hover:text-[#0B0D10]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'tagged' 
                ? 'text-[#0B0D10] border-b-2 border-purple-600' 
                : 'text-gray-500 hover:text-[#0B0D10]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Tagged
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post.id} post={post} onUserClick={() => {}} />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Grid3X3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-[#0B0D10] mb-2">No posts yet</h3>
                <p className="text-sm text-gray-500">When {user.name} shares posts, they'll appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-[#0B0D10] mb-2">Saved posts</h3>
            <p className="text-sm text-gray-500">Save posts to view them later.</p>
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-[#0B0D10] mb-2">Tagged posts</h3>
            <p className="text-sm text-gray-500">When someone tags {user.name}, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
