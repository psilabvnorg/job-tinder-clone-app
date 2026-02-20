import { useState, useEffect } from 'react'
import { getStories, getPosts, categories, categoryEmojis, formatNumber } from '../services/database'

const categoryLabels = {
  All: 'Tất cả',
  IELTS: 'IELTS',
  Marketing: 'Tiếp thị',
  Finance: 'Tài chính',
  MBA: 'MBA',
  Design: 'Thiết kế',
  Leadership: 'Lãnh đạo',
}

// Icons
const HeartIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'} stroke={filled ? '#ef4444' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>
  </svg>
)

const CommentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>
  </svg>
)

const ShareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
)

const BookmarkIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? '#9333ea' : 'none'} stroke={filled ? '#9333ea' : 'currentColor'} strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
)

const VerifiedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

// Stories Component
function Stories({ stories }) {
  const [activeStory, setActiveStory] = useState(null)

  return (
    <div className="edu-stories">
      <div className="edu-story-item">
        <button className="edu-story-add">
          <PlusIcon />
        </button>
        <span className="edu-story-name">Thêm</span>
      </div>

      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => setActiveStory(story.id)}
          className="edu-story-item"
        >
          <div className={`edu-story-ring ${story.hasUnseen ? 'unseen' : ''} ${activeStory === story.id ? 'active' : ''}`}>
            <img src={story.image} alt={story.user.name} className="edu-story-avatar" />
            {story.hasUnseen && <span className="edu-story-badge" />}
          </div>
          <span className={`edu-story-name ${story.hasUnseen ? 'unseen' : ''}`}>
            {story.user.name.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  )
}

function Post({ post }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  return (
    <article className="edu-post">
      <div className="edu-post-header">
        <div className="edu-post-user">
          <div className="edu-post-avatar-wrap">
            <img src={post.author.avatar} alt={post.author.name} className="edu-post-avatar" />
            <span className="edu-post-online" />
          </div>
          <div className="edu-post-user-info">
            <div className="edu-post-name-row">
              <span className="edu-post-name">{post.author.name}</span>
              {post.author.verified && <VerifiedIcon />}
            </div>
            <span className="edu-post-username">@{post.author.username}</span>
          </div>
        </div>
        <div className="edu-post-header-right">
          <span className="edu-post-category">{post.category}</span>
          <button className="edu-post-more"><MoreIcon /></button>
        </div>
      </div>

      {post.image && (
        <div className="edu-post-image">
          <img src={post.image} alt="Post" />
        </div>
      )}

      <div className="edu-post-content">
        <div className="edu-post-actions">
          <div className="edu-post-actions-left">
            <button onClick={handleLike} className={`edu-action-btn ${liked ? 'liked' : ''}`}>
              <HeartIcon filled={liked} />
            </button>
            <button onClick={() => setShowComments(!showComments)} className="edu-action-btn">
              <CommentIcon />
            </button>
            <button className="edu-action-btn"><ShareIcon /></button>
          </div>
          <button onClick={() => setSaved(!saved)} className={`edu-action-btn ${saved ? 'saved' : ''}`}>
            <BookmarkIcon filled={saved} />
          </button>
        </div>

        <p className="edu-post-likes">{formatNumber(likes)} likes</p>

        <div className="edu-post-caption">
          <span className="edu-post-caption-user">{post.author.username}</span>{' '}
          <span className="edu-post-caption-text">{post.content}</span>
        </div>

        {post.quiz && (
          <div className="edu-quiz">
            <p className="edu-quiz-label">Câu hỏi</p>
            <p className="edu-quiz-question">{post.quiz.question}</p>
            <div className="edu-quiz-options">
              {post.quiz.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedQuiz(opt.id)}
                  className={`edu-quiz-option ${selectedQuiz === opt.id ? 'selected' : ''}`}
                >
                  <span className="edu-quiz-option-label">{opt.label}</span>
                  <span className="edu-quiz-option-text">{opt.text}</span>
                </button>
              ))}
            </div>
            {selectedQuiz && (
              <div className={`edu-quiz-result ${selectedQuiz === post.quiz.correctId ? 'correct' : 'wrong'}`}>
                <span className="edu-quiz-result-icon">
                  {selectedQuiz === post.quiz.correctId ? <CheckIcon /> : <XIcon />}
                </span>
                <div>
                  <p className="edu-quiz-result-title">{selectedQuiz === post.quiz.correctId ? 'Correct!' : 'Not quite yet.'}</p>
                  <p className="edu-quiz-result-text">{post.quiz.explanation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="edu-post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="edu-post-tag">#{tag}</span>
          ))}
        </div>

        <p className="edu-post-time">{post.time}</p>

        <button className="edu-post-comments-btn" onClick={() => setShowComments(!showComments)}>
          Xem tất cả {post.comments} bình luận
        </button>

        {showComments && (
          <div className="edu-comments-section">
            <div className="edu-comment-input-wrap">
              <input type="text" placeholder="Add a comment..." className="edu-comment-input" />
              <button className="edu-comment-send">Đăng</button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function CategoryHeader({ category, postCount }) {
  return (
    <div className="edu-category-header">
      <div className="edu-category-icon">
        <span>{categoryEmojis[category] || '📚'}</span>
      </div>
      <div className="edu-category-info">
        <h2 className="edu-category-title">{category}</h2>
        <p className="edu-category-count">{postCount} posts</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="edu-empty-state">
      <div className="edu-empty-icon">
        <span>📚</span>
      </div>
      <h3 className="edu-empty-title">No posts yet</h3>
      <p className="edu-empty-text">Be the first to share in this category!</p>
    </div>
  )
}

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [stories, setStories] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [storiesData, postsData] = await Promise.all([
          getStories(),
          getPosts()
        ])
        setStories(storiesData)
        setAllPosts(postsData)
      } catch (err) {
        console.error('Error loading feed data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredPosts = selectedCategory === 'All' 
    ? allPosts 
    : allPosts.filter(post => post.category === selectedCategory)

  if (loading) {
    return <div className="edu-feed"><p style={{ padding: '2rem', textAlign: 'center' }}>Loading...</p></div>
  }

  return (
    <div className="edu-feed">
      <Stories stories={stories} />

      <div className="edu-category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`edu-category-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat !== 'All' && <span className="edu-category-emoji">{categoryEmojis[cat]}</span>}
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {selectedCategory !== 'All' && (
        <CategoryHeader category={selectedCategory} postCount={filteredPosts.length} />
      )}

      <div className="edu-posts">
        {filteredPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && <EmptyState />}

      {filteredPosts.length > 0 && (
        <div className="edu-load-more">
          <button className="edu-load-more-btn">Tải thêm bài viết</button>
        </div>
      )}
    </div>
  )
}
