import { useState, useCallback } from 'react'
import JobSwipe from './components/JobSwipe'
import FeedPage from './components/FeedPage'
import LearningHubPage from './components/LearningHubPage'
import AdvisorProfilePage from './components/AdvisorProfilePage'
import ProfilePage from './components/ProfilePage'

// SVG Icons
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    <rect width="20" height="14" x="2" y="6" rx="2"/>
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5"/>
    <path d="M20 21a8 8 0 0 0-16 0"/>
  </svg>
)

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
)

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7v14"/>
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h13a4 4 0 0 1 4 4v14a1 1 0 0 1-1 1H4a2 2 0 0 0-2 2"/>
    <path d="M8 3v4"/>
  </svg>
)

const LayoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2"/>
    <path d="M3 9h18"/>
    <path d="M9 21V9"/>
  </svg>
)

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function App() {
  const [activeView, setActiveView] = useState('swipe')
  const [savedJobs, setSavedJobs] = useState([])
  const [passedJobs, setPassedJobs] = useState([])

  const handleSwipeRight = useCallback((job) => {
    setSavedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev
      return [...prev, job]
    })
  }, [])

  const handleSwipeLeft = useCallback((job) => {
    setPassedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev
      return [...prev, job]
    })
  }, [])

  const handleRemoveSaved = useCallback((jobId) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId))
  }, [])

  const navItems = [
    { id: 'swipe', icon: BriefcaseIcon, label: 'Vuốt' },
    { id: 'matched', icon: () => <HeartIcon filled={false} />, label: 'Đã lưu', badge: savedJobs.length },
    { id: 'feed', icon: LayoutIcon, label: 'Bảng tin' },
    { id: 'learning', icon: BookIcon, label: 'Học tập' },
    { id: 'advisor', icon: SparklesIcon, label: 'Cố vấn' },
  ]

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">💼</div>
          <span className="header-title">JobSwipe</span>
        </div>
        <div className="header-actions">
          <button 
            className="header-btn"
            onClick={() => setActiveView('matched')}
          >
            <HeartIcon filled={false} />
            {savedJobs.length > 0 && (
              <span className="badge">{savedJobs.length}</span>
            )}
          </button>
          <button 
            className="header-btn"
            onClick={() => setActiveView('profile')}
          >
            <UserIcon />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {activeView === 'swipe' && (
          <JobSwipe
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        )}

        {activeView === 'matched' && (
          <div className="saved-view">
            <div className="saved-header">
              <h2 className="saved-title">Việc đã lưu</h2>
              <p className="saved-subtitle">
                {savedJobs.length} {savedJobs.length === 1 ? 'việc' : 'việc'} đã lưu
              </p>
            </div>

            {savedJobs.length === 0 ? (
              <div className="empty-state">
                <HeartIcon filled={false} />
                <div className="empty-state-title">Chưa có việc nào được lưu</div>
                <div className="empty-state-text">
                  Vuốt sang phải để lưu việc bạn thích
                </div>
              </div>
            ) : (
              <div className="saved-list">
                {savedJobs.map((job) => (
                  <div key={job.id} className="saved-card">
                    <div className="saved-card-header">
                      <div>
                        <div className="saved-card-title">{job.title}</div>
                        <div className="saved-card-company">{job.company}</div>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveSaved(job.id)}
                      >
                        <XIcon />
                      </button>
                    </div>
                    <div className="saved-card-salary">{job.salary}</div>
                    <div className="saved-card-meta">
                      <span><MapPinIcon /> {job.location}</span>
                      {job.remote && <span>🏠 Làm việc từ xa</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'feed' && <FeedPage />}

        {activeView === 'learning' && <LearningHubPage />}

        {activeView === 'advisor' && <AdvisorProfilePage />}

        {activeView === 'profile' && <ProfilePage />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <item.icon />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
