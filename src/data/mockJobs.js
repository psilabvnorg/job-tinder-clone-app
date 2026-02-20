// Mock job data for JobSwipe app
// Inspired by the structure from edugram-app-master/src/data/mockData.ts

// Instructors/Mentors data
export const instructors = [
  { id: 1, name: 'Steve Jobs', username: 'steve.marketing', avatar: '/image/instructors/steve-jobs.jpg', category: 'Marketing', verified: true },
  { id: 2, name: 'Warren Buffett', username: 'warren.finance', avatar: '/image/instructors/warren-buffett.jpg', category: 'Finance', verified: true },
  { id: 3, name: 'Simon Sinek', username: 'simon.leadership', avatar: '/image/instructors/simon-sinek.jpg', category: 'Leadership', verified: true },
  { id: 4, name: 'Sarah Chen', username: 'sarah.ielts', avatar: '/image/instructors/sarah-chen.jpg', category: 'IELTS', verified: true },
  { id: 5, name: 'Alex Rivera', username: 'alex.design', avatar: '/image/instructors/alex-design.jpg', category: 'Design', verified: true },
  { id: 6, name: 'Dr. David Kim', username: 'david.mba', avatar: '/image/instructors/david-mba.jpg', category: 'MBA', verified: true },
];

// Stories data
export const stories = [
  { id: 1, user: { name: 'Steve Jobs', username: 'steve.marketing' }, image: '/image/instructors/steve-jobs.jpg', hasUnseen: true },
  { id: 2, user: { name: 'Warren Buffett', username: 'warren.finance' }, image: '/image/instructors/warren-buffett.jpg', hasUnseen: true },
  { id: 3, user: { name: 'Simon Sinek', username: 'simon.leadership' }, image: '/image/instructors/simon-sinek.jpg', hasUnseen: true },
  { id: 4, user: { name: 'Sarah Chen', username: 'sarah.ielts' }, image: '/image/instructors/sarah-chen.jpg', hasUnseen: false },
  { id: 5, user: { name: 'Alex Rivera', username: 'alex.design' }, image: '/image/instructors/alex-design.jpg', hasUnseen: true },
  { id: 6, user: { name: 'Dr. David Kim', username: 'david.mba' }, image: '/image/instructors/david-mba.jpg', hasUnseen: false },
];

// Categories
export const categories = ['All', 'IELTS', 'Marketing', 'Finance', 'MBA', 'Design', 'Leadership'];

export const categoryEmojis = {
  'IELTS': '📖',
  'Marketing': '📈',
  'Finance': '💰',
  'MBA': '🎓',
  'Design': '🎨',
  'Leadership': '💡',
};

// Posts data (educational content)
export const posts = [
  {
    id: 1,
    author: instructors[0],
    time: '3 hours ago',
    content: `Marketing isn't about selling. It's about connecting.

The best products don't need aggressive sales tactics. They solve real problems for real people.

Ask yourself:
• What pain am I solving?
• Who feels it most?
• How do I reach them?

When you truly understand your customer, marketing becomes a conversation, not a pitch.`,
    image: '/image/posts/focus-study.jpg',
    tags: ['marketing', 'designthinking', 'innovation'],
    likes: 45200,
    comments: 36,
    category: 'Marketing',
    quiz: {
      question: 'Which line best reflects the idea in this post?',
      options: [
        { id: 'a', label: 'A', text: 'Marketing is about persuasion through discounts.' },
        { id: 'b', label: 'B', text: 'Marketing starts with solving a real customer pain.' },
        { id: 'c', label: 'C', text: 'Marketing works only with large budgets.' },
      ],
      correctId: 'b',
      explanation: 'The post emphasizes solving real customer problems before pitching.',
      commentPrompt: 'Explain your answer: What customer pain have you seen most often?',
    },
  },
  {
    id: 2,
    author: instructors[1],
    time: '5 hours ago',
    content: `Rule #1: Never lose money.
Rule #2: Never forget Rule #1.

Compounding is the 8th wonder of the world. Start early, stay consistent, and let time do the heavy lifting.

A 20-year-old investing $500/month at 8% return will have $1.4M at 60.

The best time to start was yesterday. The second best time is today.`,
    image: '/image/topics/finance.jpg',
    tags: ['investing', 'personalfinance', 'wealth'],
    likes: 67800,
    comments: 74,
    category: 'Finance',
    quiz: {
      question: 'What makes compounding powerful in this example?',
      options: [
        { id: 'a', label: 'A', text: 'Starting early and staying consistent.' },
        { id: 'b', label: 'B', text: 'Timing the market weekly.' },
        { id: 'c', label: 'C', text: 'Investing only in high-risk assets.' },
      ],
      correctId: 'a',
      explanation: 'Consistent contributions over time let compound growth do the heavy lifting.',
      commentPrompt: 'Explain your answer: How would you stay consistent?',
    },
  },
  {
    id: 3,
    author: instructors[3],
    time: '7 hours ago',
    content: `IELTS Speaking Tip: The 3-Second Rule

When the examiner asks a question, take 3 seconds before answering. This simple technique will:

✅ Reduce filler words (um, uh, like)
✅ Organize your thoughts
✅ Show confidence
✅ Improve fluency score

Practice: Record yourself answering questions with and without the pause. Hear the difference?`,
    image: '/image/topics/ielts.jpg',
    tags: ['ielts', 'speaking', 'englishtips'],
    likes: 23100,
    comments: 42,
    category: 'IELTS',
  },
  {
    id: 4,
    author: instructors[2],
    time: '8 hours ago',
    content: `Leaders don't create followers. They create more leaders.

Your job isn't to have all the answers. It's to create an environment where your team can find them.

Great leaders:
• Listen more than they speak
• Give credit, take blame
• Develop their people
• Lead with empathy

Who are you developing today?`,
    image: '/image/posts/community.jpg',
    tags: ['leadership', 'management', 'teamwork'],
    likes: 38900,
    comments: 42,
    category: 'Leadership',
  },
  {
    id: 5,
    author: instructors[4],
    time: '10 hours ago',
    content: `Good design is invisible. Great design is memorable.

The best user experiences feel effortlessly because countless design decisions were made to remove friction.

Design principles to live by:
1. Clarity over cleverness
2. Consistency builds trust
3. White space is not empty space
4. Every element must earn its place

Design is not just what it looks like. It's how it works.`,
    image: '/image/topics/design.jpg',
    tags: ['uxdesign', 'designthinking', 'ui'],
    likes: 28400,
    comments: 58,
    category: 'Design',
  },
  {
    id: 6,
    author: instructors[5],
    time: '12 hours ago',
    content: `The 5 Forces That Shape Strategy (Porter's Framework)

Understanding your competitive landscape is crucial:

1. Threat of new entrants
2. Bargaining power of suppliers
3. Bargaining power of buyers
4. Threat of substitutes
5. Competitive rivalry

Analyze these forces before entering any market. The strongest force determines industry profitability.`,
    image: '/image/topics/mba.jpg',
    tags: ['mba', 'strategy', 'business'],
    likes: 41200,
    comments: 35,
    category: 'MBA',
  },
];

export const companies = [
  {
    id: '1',
    name: 'TechViet Solutions',
    logo: '/image/steve-jobs.jpg',
    industry: 'Technology',
    size: '100-500',
    location: 'Hà Nội',
  },
  {
    id: '2',
    name: 'VinaTech Group',
    logo: '/image/warren-buffet.jpg',
    industry: 'Software Development',
    size: '500-1000',
    location: 'Hồ Chí Minh',
  },
  {
    id: '3',
    name: 'Digital Marketing Hub',
    logo: '/image/elon-musk.jpg',
    industry: 'Marketing',
    size: '50-100',
    location: 'Đà Nẵng',
  },
];

export const mockJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'TechViet Solutions',
    companyId: '1',
    location: 'Hà Nội',
    salary: '25-35 triệu',
    type: 'Full-time',
    remote: true,
    category: 'Technology',
    description: 'Chúng tôi đang tìm kiếm Senior Frontend Developer có kinh nghiệm với React và TypeScript để xây dựng các ứng dụng web hiện đại.',
    requirements: [
      '3+ năm kinh nghiệm React/TypeScript',
      'Thành thạo HTML, CSS, JavaScript',
      'Kinh nghiệm với Redux, React Query',
      'Hiểu biết về UX/UI principles',
      'Tiếng Anh giao tiếp tốt',
    ],
    benefits: [
      'Lương cạnh tranh + thưởng',
      'Bảo hiểm đầy đủ',
      'Làm việc từ xa linh hoạt',
      'Đào tạo và phát triển',
    ],
    backgroundImage: '/image/topics/design.jpg',
    source: 'TopCV',
    url: 'https://example.com/job-1',
    postedDate: '2 ngày trước',
    expiryDate: '30 ngày',
  },
  {
    id: 'job-2',
    title: 'Full Stack Developer',
    company: 'VinaTech Group',
    companyId: '2',
    location: 'Hồ Chí Minh',
    salary: '20-30 triệu',
    type: 'Full-time',
    remote: false,
    category: 'Technology',
    description: 'Tham gia phát triển hệ thống quản lý doanh nghiệp với công nghệ Node.js và React.',
    requirements: [
      '2+ năm kinh nghiệm Full Stack',
      'Node.js, Express, MongoDB',
      'React, Next.js',
      'RESTful API, GraphQL',
      'Git, Docker',
    ],
    benefits: [
      'Lương thỏa thuận',
      'Thưởng dự án',
      'Team building',
      'Môi trường trẻ trung',
    ],
    backgroundImage: '/image/topics/mba.jpg',
    source: 'VietnamWorks',
    url: 'https://example.com/job-2',
    postedDate: '1 tuần trước',
    expiryDate: '23 ngày',
  },
  {
    id: 'job-3',
    title: 'Digital Marketing Manager',
    company: 'Digital Marketing Hub',
    companyId: '3',
    location: 'Đà Nẵng',
    salary: '18-25 triệu',
    type: 'Full-time',
    remote: true,
    category: 'Marketing',
    description: 'Quản lý và triển khai các chiến dịch marketing online cho khách hàng trong và ngoài nước.',
    requirements: [
      '3+ năm kinh nghiệm Digital Marketing',
      'Google Ads, Facebook Ads',
      'SEO/SEM, Content Marketing',
      'Analytics và báo cáo',
      'Tiếng Anh thành thạo',
    ],
    benefits: [
      'Lương hấp dẫn + KPI',
      'Làm việc từ xa',
      'Đào tạo chuyên sâu',
      'Cơ hội thăng tiến',
    ],
    backgroundImage: '/image/topics/marketing.jpg',
    source: 'CareerBuilder',
    url: 'https://example.com/job-3',
    postedDate: '3 ngày trước',
    expiryDate: '27 ngày',
  },
  {
    id: 'job-4',
    title: 'Backend Developer (Node.js)',
    company: 'TechViet Solutions',
    companyId: '1',
    location: 'Hà Nội',
    salary: '22-32 triệu',
    type: 'Full-time',
    remote: true,
    category: 'Technology',
    description: 'Phát triển và bảo trì hệ thống backend cho các ứng dụng quy mô lớn.',
    requirements: [
      '2+ năm kinh nghiệm Node.js',
      'PostgreSQL, MongoDB',
      'Microservices architecture',
      'Docker, Kubernetes',
      'CI/CD pipelines',
    ],
    benefits: [
      'Lương cạnh tranh',
      'Remote flexible',
      'Công nghệ mới nhất',
      'Bảo hiểm cao cấp',
    ],
    backgroundImage: '/image/topics/finance.jpg',
    source: 'ITviec',
    url: 'https://example.com/job-4',
    postedDate: '5 ngày trước',
    expiryDate: '25 ngày',
  },
  {
    id: 'job-5',
    title: 'UI/UX Designer',
    company: 'VinaTech Group',
    companyId: '2',
    location: 'Hồ Chí Minh',
    salary: '15-22 triệu',
    type: 'Full-time',
    remote: false,
    category: 'Design',
    description: 'Thiết kế giao diện và trải nghiệm người dùng cho các sản phẩm digital.',
    requirements: [
      '2+ năm kinh nghiệm UI/UX',
      'Figma, Adobe XD, Sketch',
      'User research, wireframing',
      'Design systems',
      'Portfolio mạnh',
    ],
    benefits: [
      'Lương thỏa thuận',
      'Công cụ thiết kế hiện đại',
      'Học hỏi từ senior',
      'Dự án đa dạng',
    ],
    backgroundImage: '/image/topics/design.jpg',
    source: 'TopCV',
    url: 'https://example.com/job-5',
    postedDate: '4 ngày trước',
    expiryDate: '26 ngày',
  },
  {
    id: 'job-6',
    title: 'Product Manager',
    company: 'Digital Marketing Hub',
    companyId: '3',
    location: 'Đà Nẵng',
    salary: '28-40 triệu',
    type: 'Full-time',
    remote: true,
    category: 'Management',
    description: 'Quản lý sản phẩm từ ý tưởng đến triển khai, làm việc với đội ngũ đa chức năng.',
    requirements: [
      '3+ năm kinh nghiệm Product Management',
      'Agile/Scrum methodology',
      'Data-driven decision making',
      'Stakeholder management',
      'Technical background là lợi thế',
    ],
    benefits: [
      'Lương cao + equity',
      'Remote 100%',
      'Quyết định sản phẩm',
      'Startup environment',
    ],
    backgroundImage: '/image/topics/leadership.jpg',
    source: 'LinkedIn',
    url: 'https://example.com/job-6',
    postedDate: '1 ngày trước',
    expiryDate: '29 ngày',
  },
  {
    id: 'job-7',
    title: 'DevOps Engineer',
    company: 'TechViet Solutions',
    companyId: '1',
    location: 'Hà Nội',
    salary: '25-35 triệu',
    type: 'Full-time',
    remote: true,
    category: 'Technology',
    description: 'Xây dựng và duy trì infrastructure, CI/CD pipelines cho các dự án lớn.',
    requirements: [
      '2+ năm kinh nghiệm DevOps',
      'AWS/GCP/Azure',
      'Docker, Kubernetes',
      'Terraform, Ansible',
      'Monitoring tools',
    ],
    benefits: [
      'Lương hấp dẫn',
      'Làm việc từ xa',
      'Cloud certifications',
      'Công nghệ tiên tiến',
    ],
    backgroundImage: '/image/topics/mba.jpg',
    source: 'ITviec',
    url: 'https://example.com/job-7',
    postedDate: '6 ngày trước',
    expiryDate: '24 ngày',
  },
  {
    id: 'job-8',
    title: 'Content Marketing Specialist',
    company: 'Digital Marketing Hub',
    companyId: '3',
    location: 'Đà Nẵng',
    salary: '12-18 triệu',
    type: 'Full-time',
    remote: true,
    category: 'Marketing',
    description: 'Sáng tạo và quản lý nội dung cho các kênh digital marketing.',
    requirements: [
      '1+ năm kinh nghiệm Content Marketing',
      'Viết content tiếng Việt và Anh',
      'SEO content writing',
      'Social media management',
      'Sáng tạo và chủ động',
    ],
    benefits: [
      'Lương cơ bản + bonus',
      'Remote flexible',
      'Đào tạo marketing',
      'Môi trường sáng tạo',
    ],
    backgroundImage: '/image/topics/marketing.jpg',
    source: 'CareerBuilder',
    url: 'https://example.com/job-8',
    postedDate: '2 ngày trước',
    expiryDate: '28 ngày',
  },
];

// Helper functions
export const getJobById = (id) => mockJobs.find(job => job.id === id);

export const getJobsByCategory = (category) => 
  category ? mockJobs.filter(job => job.category === category) : mockJobs;

export const getJobsByLocation = (location) =>
  location ? mockJobs.filter(job => job.location === location) : mockJobs;

export const getJobsByCompany = (companyId) =>
  mockJobs.filter(job => job.companyId === companyId);

export const getAllCategories = () => 
  [...new Set(mockJobs.map(job => job.category))];

export const getAllLocations = () =>
  [...new Set(mockJobs.map(job => job.location))];

export const getCompanyById = (id) => companies.find(c => c.id === id);

export const formatSalary = (salary) => salary;

export const formatDate = (date) => date;

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Practice questions for Learning Hub (from edugram pattern)
export const practiceQuestions = [
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
    image: '/image/practice/ielts-speaking.jpg',
  },
  {
    id: 'practice-2',
    topic: 'Design',
    title: 'Swipe Practice · UX Basics',
    question: 'Which principle best matches "good design is invisible"?',
    options: [
      { id: 'p2-a', label: 'A', text: 'Focus on user goals before visuals.' },
      { id: 'p2-b', label: 'B', text: 'Add more UI decoration for engagement.' },
      { id: 'p2-c', label: 'C', text: 'Use every feature to show capability.' },
    ],
    correctOptionId: 'p2-a',
    explanation: 'If users reach their goals effortlessly, the design stays out of the way.',
    image: '/image/practice/design-invisible.jpg',
  },
  {
    id: 'practice-3',
    topic: 'Finance',
    title: 'Quick Check · Investing',
    question: 'What is the core message of "Rule #1: Never lose money"?',
    options: [
      { id: 'p3-a', label: 'A', text: 'Prioritize capital preservation before growth.' },
      { id: 'p3-b', label: 'B', text: 'Avoid all investments entirely.' },
      { id: 'p3-c', label: 'C', text: 'Trade daily for higher returns.' },
    ],
    correctOptionId: 'p3-a',
    explanation: 'Risk management comes first so you can stay in the game long term.',
    image: '/image/practice/finance-rule.jpg',
  },
];
