import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Feed } from '@/components/Feed';
import { Stories } from '@/components/Stories';
import { Profile } from '@/components/Profile';
import { Explore } from '@/components/Explore';
import { Chat } from '@/components/Chat';
import type { User, Category } from '@/types';
import { users, getPostsByUser } from '@/data/mockData';
import { Menu, X, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './App.css';

type ViewType = 'feed' | 'explore' | 'profile' | 'chat';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('feed');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser] = useState<User>(users[0]);

  // Handle navigation
  const navigateToProfile = (user: User) => {
    setSelectedUser(user);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToFeed = () => {
    setCurrentView('feed');
    setSelectedUser(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToExplore = () => {
    setCurrentView('explore');
    setSelectedUser(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToChat = (user: User) => {
    setSelectedUser(user);
    setCurrentView('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#F6F7F9]/80 backdrop-blur-xl border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button 
              onClick={navigateToFeed}
              className="text-xl font-bold tracking-tight text-[#0B0D10]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              EduGram
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search topics, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border-[#E5E7EB] rounded-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-[#0B0D10]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full" />
            </button>
            <Button 
              className="hidden sm:flex bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5 text-sm font-medium"
            >
              Get the app
            </Button>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
              onClick={() => navigateToProfile(currentUser)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-xl">
            <Sidebar 
              currentView={currentView}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onNavigateFeed={navigateToFeed}
              onNavigateExplore={navigateToExplore}
            />
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="pt-16 flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-[#E5E7EB] bg-white/50">
          <Sidebar 
            currentView={currentView}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onNavigateFeed={navigateToFeed}
            onNavigateExplore={navigateToExplore}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 lg:mr-80">
          <div className="max-w-2xl mx-auto px-4 py-6">
            {currentView === 'feed' && (
              <>
                {/* Stories */}
                <Stories onUserClick={navigateToProfile} />
                
                {/* Feed */}
                <Feed 
                  category={selectedCategory}
                  onUserClick={navigateToProfile}
                />
              </>
            )}

            {currentView === 'explore' && (
              <Explore 
                onTopicClick={(category) => {
                  setSelectedCategory(category);
                  setCurrentView('feed');
                }}
                onUserClick={navigateToProfile}
              />
            )}

            {currentView === 'profile' && selectedUser && (
              <Profile 
                user={selectedUser}
                posts={getPostsByUser(selectedUser.id)}
                onBack={navigateToFeed}
                onMessageClick={navigateToChat}
              />
            )}

            {currentView === 'chat' && selectedUser && (
              <Chat 
                user={selectedUser}
                onBack={() => navigateToProfile(selectedUser)}
              />
            )}
          </div>
        </main>

        {/* Right Sidebar - Desktop */}
        <aside className="hidden xl:block w-80 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-[#E5E7EB] bg-white/50 p-6">
          <RightSidebar onUserClick={navigateToProfile} />
        </aside>
      </div>
    </div>
  );
}

// Right Sidebar Component
function RightSidebar({ onUserClick }: { onUserClick: (user: User) => void }) {
  const suggestedUsers = users.slice(1, 5);
  const trendingTopics = ['#IELTS', '#Marketing', '#Finance', '#Leadership', '#Design'];
  const learningPath = [
    { title: 'Build a study habit', progress: 60 },
    { title: 'Master core concepts', progress: 35 },
    { title: 'Apply in real projects', progress: 10 },
  ];

  return (
    <div className="space-y-8">
      {/* Suggested Instructors */}
      <div>
        <h3 className="text-sm font-semibold text-[#0B0D10] mb-4 uppercase tracking-wider">
          Suggested Instructors
        </h3>
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div 
              key={user.id}
              className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer transition-colors"
              onClick={() => onUserClick(user)}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0B0D10] truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.username}</p>
              </div>
              <button className="text-xs font-medium text-purple-600 hover:text-purple-700">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div>
        <h3 className="text-sm font-semibold text-[#0B0D10] mb-4 uppercase tracking-wider">
          Trending Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-xs font-medium text-[#0B0D10] hover:border-purple-300 cursor-pointer transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white">
        <h3 className="text-sm font-semibold mb-2">Daily Challenge</h3>
        <p className="text-sm text-purple-100 mb-4">
          Complete today's IELTS speaking exercise and earn 50 XP!
        </p>
        <button className="w-full py-2 bg-white text-purple-600 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors">
          Start Challenge
        </button>
      </div>

      {/* Learning Path */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#0B0D10]">Your Learning Path</h3>
          <span className="text-xs font-medium text-purple-600">Week 2</span>
        </div>
        <div className="space-y-4">
          {learningPath.map((step) => (
            <div key={step.title}>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{step.title}</span>
                <span>{step.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-purple-600"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <button className="mt-5 w-full rounded-full border border-purple-200 bg-purple-50 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors">
          View full plan
        </button>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>© 2025 EduGram</p>
        <p>Learn in bursts. Remember forever.</p>
      </div>
    </div>
  );
}

export default App;
