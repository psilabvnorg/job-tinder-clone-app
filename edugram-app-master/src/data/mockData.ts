import type { User, Post, Story, Topic, Comment, PracticeQuestion } from '@/types';

// AI-Generated Instructors
export const users: User[] = [
  {
    id: '1',
    name: 'Steve Jobs',
    username: 'steve.marketing',
    avatar: '/images/instructors/steve-jobs.jpg',
    bio: 'Former Apple CEO. Teaching marketing, design thinking, and innovation. Stay hungry, stay foolish.',
    category: 'Marketing',
    followers: 2450000,
    following: 12,
    posts: 156,
    isVerified: true,
    isFollowing: false,
  },
  {
    id: '2',
    name: 'Warren Buffett',
    username: 'warren.finance',
    avatar: '/images/instructors/warren-buffett.jpg',
    bio: 'Chairman & CEO of Berkshire Hathaway. Teaching value investing and financial wisdom.',
    category: 'Finance',
    followers: 3200000,
    following: 8,
    posts: 203,
    isVerified: true,
    isFollowing: false,
  },
  {
    id: '3',
    name: 'Simon Sinek',
    username: 'simon.leadership',
    avatar: '/images/instructors/simon-sinek.jpg',
    bio: 'Optimist. Teaching leadership, Start with Why, and infinite mindset.',
    category: 'Leadership',
    followers: 1890000,
    following: 45,
    posts: 178,
    isVerified: true,
    isFollowing: false,
  },
  {
    id: '4',
    name: 'Sarah Chen',
    username: 'sarah.ielts',
    avatar: '/images/instructors/sarah-chen.jpg',
    bio: 'IELTS Expert | Band 9.0 | Helping you achieve your dream score. English teacher for 10+ years.',
    category: 'IELTS',
    followers: 567000,
    following: 234,
    posts: 412,
    isVerified: true,
    isFollowing: false,
  },
  {
    id: '5',
    name: 'Alex Rivera',
    username: 'alex.design',
    avatar: '/images/instructors/alex-design.jpg',
    bio: 'Product Designer @ Google. Teaching UX/UI, design systems, and creative thinking.',
    category: 'Design',
    followers: 892000,
    following: 567,
    posts: 289,
    isVerified: true,
    isFollowing: false,
  },
  {
    id: '6',
    name: 'Dr. David Kim',
    username: 'david.mba',
    avatar: '/images/instructors/david-mba.jpg',
    bio: 'Harvard Business School Professor. Teaching strategy, management, and entrepreneurship.',
    category: 'MBA',
    followers: 1450000,
    following: 23,
    posts: 198,
    isVerified: true,
    isFollowing: false,
  },
];

// Sample Comments
const generateComments = (postId: string): Comment[] => [
  {
    id: `${postId}-c1`,
    userId: '3',
    user: users[2],
    content: 'This is exactly what I needed to hear today! 🙌',
    likes: 234,
    createdAt: '2 hours ago',
  },
  {
    id: `${postId}-c2`,
    userId: '4',
    user: users[3],
    content: 'Amazing insights! Saving this for later.',
    likes: 156,
    createdAt: '4 hours ago',
  },
  {
    id: `${postId}-c3`,
    userId: '5',
    user: users[4],
    content: 'Love how you break down complex concepts!',
    likes: 89,
    createdAt: '6 hours ago',
  },
];

// Posts
export const posts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: users[0],
    image: '/images/posts/focus-study.jpg',
    content: `Marketing isn't about selling. It's about connecting.

The best products don't need aggressive sales tactics. They solve real problems for real people.

Ask yourself:
• What pain am I solving?
• Who feels it most?
• How do I reach them?

When you truly understand your customer, marketing becomes a conversation, not a pitch.`,
    category: 'Marketing',
    likes: 45200,
    comments: generateComments('1'),
    isLiked: false,
    isSaved: false,
    createdAt: '3 hours ago',
    tags: ['marketing', 'designthinking', 'innovation'],
    quiz: {
      id: 'quiz-1',
      question: 'Which line best reflects the idea in this post?',
      options: [
        { id: 'q1-a', label: 'A', text: 'Marketing is about persuasion through discounts.' },
        { id: 'q1-b', label: 'B', text: 'Marketing starts with solving a real customer pain.' },
        { id: 'q1-c', label: 'C', text: 'Marketing works only with large budgets.' },
      ],
      correctOptionId: 'q1-b',
      explanation: 'The post emphasizes solving real customer problems before pitching.',
      commentPrompt: 'Explain your answer: What customer pain have you seen most often?',
    },
  },
  {
    id: '2',
    userId: '2',
    user: users[1],
    image: '/images/topics/finance.jpg',
    content: `Rule #1: Never lose money.
Rule #2: Never forget Rule #1.

Compounding is the 8th wonder of the world. Start early, stay consistent, and let time do the heavy lifting.

A 20-year-old investing $500/month at 8% return will have $1.4M at 60.

The best time to start was yesterday. The second best time is today.`,
    category: 'Finance',
    likes: 67800,
    comments: generateComments('2'),
    isLiked: false,
    isSaved: false,
    createdAt: '5 hours ago',
    tags: ['investing', 'personalfinance', 'wealth'],
    quiz: {
      id: 'quiz-2',
      question: 'What makes compounding powerful in this example?',
      options: [
        { id: 'q2-a', label: 'A', text: 'Starting early and staying consistent.' },
        { id: 'q2-b', label: 'B', text: 'Timing the market weekly.' },
        { id: 'q2-c', label: 'C', text: 'Investing only in high-risk assets.' },
      ],
      correctOptionId: 'q2-a',
      explanation: 'Consistent contributions over time let compound growth do the heavy lifting.',
      commentPrompt: 'Explain your answer: How would you stay consistent?',
    },
  },
  {
    id: '3',
    userId: '4',
    user: users[3],
    image: '/images/topics/ielts.jpg',
    content: `IELTS Speaking Tip: The 3-Second Rule

When the examiner asks a question, take 3 seconds before answering. This simple technique will:

✅ Reduce filler words (um, uh, like)
✅ Organize your thoughts
✅ Show confidence
✅ Improve fluency score

Practice: Record yourself answering questions with and without the pause. Hear the difference?`,
    category: 'IELTS',
    likes: 23100,
    comments: generateComments('3'),
    isLiked: false,
    isSaved: false,
    createdAt: '7 hours ago',
    tags: ['ielts', 'speaking', 'englishtips'],
  },
  {
    id: '4',
    userId: '3',
    user: users[2],
    image: '/images/posts/community.jpg',
    content: `Leaders don't create followers. They create more leaders.

Your job isn't to have all the answers. It's to create an environment where your team can find them.

Great leaders:
• Listen more than they speak
• Give credit, take blame
• Develop their people
• Lead with empathy

Who are you developing today?`,
    category: 'Leadership',
    likes: 38900,
    comments: generateComments('4'),
    isLiked: false,
    isSaved: false,
    createdAt: '8 hours ago',
    tags: ['leadership', 'management', 'teamwork'],
  },
  {
    id: '5',
    userId: '5',
    user: users[4],
    image: '/images/topics/design.jpg',
    content: `Good design is invisible. Great design is memorable.

The best user experiences feel effortless because countless design decisions were made to remove friction.

Design principles to live by:
1. Clarity over cleverness
2. Consistency builds trust
3. White space is not empty space
4. Every element must earn its place

Design is not just what it looks like. It's how it works.`,
    category: 'Design',
    likes: 28400,
    comments: generateComments('5'),
    isLiked: false,
    isSaved: false,
    createdAt: '10 hours ago',
    tags: ['uxdesign', 'designthinking', 'ui'],
  },
  {
    id: '6',
    userId: '6',
    user: users[5],
    image: '/images/topics/mba.jpg',
    content: `The 5 Forces That Shape Strategy (Porter's Framework)

Understanding your competitive landscape is crucial:

1. Threat of new entrants
2. Bargaining power of suppliers
3. Bargaining power of buyers
4. Threat of substitutes
5. Competitive rivalry

Analyze these forces before entering any market. The strongest force determines industry profitability.`,
    category: 'MBA',
    likes: 41200,
    comments: generateComments('6'),
    isLiked: false,
    isSaved: false,
    createdAt: '12 hours ago',
    tags: ['mba', 'strategy', 'business'],
  },
  {
    id: '7',
    userId: '1',
    user: users[0],
    image: '/images/topics/marketing.jpg',
    content: `Simple is harder than complex.

Anyone can build something complicated. It takes courage to remove features, simplify messaging, and focus on what truly matters.

Apple's product line fits on one table. That's not a limitation—it's a competitive advantage.

What can you remove from your product today?`,
    category: 'Marketing',
    likes: 52300,
    comments: generateComments('7'),
    isLiked: false,
    isSaved: false,
    createdAt: '14 hours ago',
    tags: ['product', 'simplicity', 'focus'],
  },
  {
    id: '8',
    userId: '2',
    user: users[1],
    image: '/images/posts/study-notes.jpg',
    content: `Price is what you pay. Value is what you get.

The stock market is a device for transferring money from the impatient to the patient.

Read 500 pages every day. That's how knowledge works. It builds up, like compound interest.

Invest in yourself. It's the best investment you'll ever make.`,
    category: 'Finance',
    likes: 71200,
    comments: generateComments('8'),
    isLiked: false,
    isSaved: false,
    createdAt: '16 hours ago',
    tags: ['valueinvesting', 'learning', 'wisdom'],
  },
];

// Practice Questions (Swipeable Cards)
export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'practice-1',
    topic: 'IELTS',
    title: 'Quick Check · IELTS Speaking',
    question: 'What is the benefit of the 3-second pause before answering?',
    options: [
      { id: 'p1-a', label: 'A', text: 'It helps you sound more confident and organized.' },
      { id: 'p1-b', label: 'B', text: 'It makes answers shorter automatically.' },
      { id: 'p1-c', label: 'C', text: 'It guarantees a perfect score.' },
    ],
    correctOptionId: 'p1-a',
    explanation: 'A short pause reduces filler words and lets you organize your response.',
    image: '/images/topics/ielts.jpg',
  },
  {
    id: 'practice-2',
    topic: 'Design',
    title: 'Swipe Practice · UX Basics',
    question: 'Which principle best matches “good design is invisible”?',
    options: [
      { id: 'p2-a', label: 'A', text: 'Focus on user goals before visuals.' },
      { id: 'p2-b', label: 'B', text: 'Add more UI decoration for engagement.' },
      { id: 'p2-c', label: 'C', text: 'Use every feature to show capability.' },
    ],
    correctOptionId: 'p2-a',
    explanation: 'If users reach their goals effortlessly, the design stays out of the way.',
    image: '/images/topics/design.jpg',
  },
  {
    id: 'practice-3',
    topic: 'Finance',
    title: 'Quick Check · Investing',
    question: 'What is the core message of “Rule #1: Never lose money”?',
    options: [
      { id: 'p3-a', label: 'A', text: 'Prioritize capital preservation before growth.' },
      { id: 'p3-b', label: 'B', text: 'Avoid all investments entirely.' },
      { id: 'p3-c', label: 'C', text: 'Trade daily for higher returns.' },
    ],
    correctOptionId: 'p3-a',
    explanation: 'Risk management comes first so you can stay in the game long term.',
    image: '/images/topics/finance.jpg',
  },
];

// Stories
export const stories: Story[] = [
  { id: '1', userId: '1', user: users[0], image: '/images/instructors/steve-jobs.jpg', hasUnseen: true },
  { id: '2', userId: '2', user: users[1], image: '/images/instructors/warren-buffett.jpg', hasUnseen: true },
  { id: '3', userId: '3', user: users[2], image: '/images/instructors/simon-sinek.jpg', hasUnseen: true },
  { id: '4', userId: '4', user: users[3], image: '/images/instructors/sarah-chen.jpg', hasUnseen: false },
  { id: '5', userId: '5', user: users[4], image: '/images/instructors/alex-design.jpg', hasUnseen: true },
  { id: '6', userId: '6', user: users[5], image: '/images/instructors/david-mba.jpg', hasUnseen: false },
];

// Topics
export const topics: Topic[] = [
  { id: '1', name: 'IELTS', category: 'IELTS', image: '/images/topics/ielts.jpg', postCount: 12500, followerCount: 890000 },
  { id: '2', name: 'Marketing', category: 'Marketing', image: '/images/topics/marketing.jpg', postCount: 23400, followerCount: 1200000 },
  { id: '3', name: 'Finance', category: 'Finance', image: '/images/topics/finance.jpg', postCount: 18900, followerCount: 980000 },
  { id: '4', name: 'MBA', category: 'MBA', image: '/images/topics/mba.jpg', postCount: 15600, followerCount: 750000 },
  { id: '5', name: 'Design', category: 'Design', image: '/images/topics/design.jpg', postCount: 21200, followerCount: 1100000 },
  { id: '6', name: 'Leadership', category: 'Leadership', image: '/images/topics/leadership.jpg', postCount: 17800, followerCount: 920000 },
];

// Helper functions
export const getUserById = (id: string): User | undefined => users.find(u => u.id === id);
export const getPostsByCategory = (category: string): Post[] => 
  category === 'All' ? posts : posts.filter(p => p.category === category);
export const getPostsByUser = (userId: string): Post[] => posts.filter(p => p.userId === userId);
export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
