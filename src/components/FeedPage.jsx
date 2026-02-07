const stories = [
  { id: 1, name: 'Minh', title: 'UI Sprint', tag: 'Hôm nay', active: true },
  { id: 2, name: 'Ly', title: 'Case Study', tag: '3h trước' },
  { id: 3, name: 'Khoa', title: 'Prototype', tag: '5h trước' },
  { id: 4, name: 'Hana', title: 'Portfolio', tag: 'Hôm qua' },
  { id: 5, name: 'Duy', title: 'Interview', tag: 'Hôm qua' }
]

const posts = [
  {
    id: 1,
    author: 'Linh Nguyen',
    role: 'Product Designer • Edugram',
    time: '12 phút trước',
    avatar: 'LN',
    content: 'Vừa hoàn thành sprint về onboarding. Đây là flow mới giúp giảm 18% drop-off sau 3 bước đầu.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    tags: ['#Onboarding', '#UXResearch', '#Metrics'],
    likes: 248,
    comments: 36,
    saves: 54
  },
  {
    id: 2,
    author: 'Edugram Studio',
    role: 'Creator • Case study series',
    time: '1 giờ trước',
    avatar: 'ES',
    content: 'Bí quyết kể chuyện trong portfolio: mở đầu bằng bối cảnh + mục tiêu, kết thúc bằng kết quả đo lường.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    tags: ['#Portfolio', '#Storytelling'],
    likes: 412,
    comments: 74,
    saves: 96
  },
  {
    id: 3,
    author: 'Trang Le',
    role: 'Mentor • Practice track',
    time: 'Hôm qua',
    avatar: 'TL',
    content: 'Bài tập tuần này: tối ưu flow đăng ký. Hãy chia sẻ wireframe của bạn để được feedback.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    tags: ['#Practice', '#Community'],
    likes: 189,
    comments: 42,
    saves: 31
  }
]

const LikeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>
  </svg>
)

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>
  </svg>
)

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <path d="m8.59 13.51 6.83 3.98"/>
    <path d="m15.42 6.51-6.83 3.98"/>
  </svg>
)

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)

export default function FeedPage() {
  return (
    <div className="feed-view">
      <div className="feed-header">
        <div>
          <h2 className="feed-title">Edugram Feed</h2>
          <p className="feed-subtitle">Stories, bài đăng và tương tác từ cộng đồng học tập</p>
        </div>
        <button className="feed-action">Tạo bài</button>
      </div>

      <div className="stories-row">
        {stories.map((story) => (
          <div key={story.id} className={`story-card ${story.active ? 'active' : ''}`}>
            <div className="story-avatar">{story.name.charAt(0)}</div>
            <div className="story-name">{story.name}</div>
            <div className="story-title">{story.title}</div>
            <span className="story-tag">{story.tag}</span>
          </div>
        ))}
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">{post.avatar}</div>
              <div className="post-meta">
                <div className="post-author">{post.author}</div>
                <div className="post-role">{post.role}</div>
              </div>
              <span className="post-time">{post.time}</span>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="post-tag">{tag}</span>
              ))}
            </div>
            <div className="post-image">
              <img src={post.image} alt="Edugram story" />
            </div>
            <div className="post-actions">
              <button className="post-action-btn">
                <LikeIcon />
                {post.likes}
              </button>
              <button className="post-action-btn">
                <MessageIcon />
                {post.comments}
              </button>
              <button className="post-action-btn">
                <ShareIcon />
                Chia sẻ
              </button>
              <button className="post-action-btn ghost">
                <BookmarkIcon />
                {post.saves}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
