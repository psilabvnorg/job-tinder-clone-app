import { useState, useRef } from 'react'

const dummyJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechFlow Inc.',
    location: 'San Francisco, CA',
    salary: '$140k - $180k',
    type: 'Full-time',
    remote: true,
    description: 'Build beautiful, performant web applications using React and TypeScript. Lead frontend architecture decisions.',
    requirements: ['5+ years React', 'TypeScript', 'Design Systems', 'Team Leadership'],
    accent: '#FFE9E6'
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'DesignLab Studio',
    location: 'New York, NY',
    salary: '$120k - $150k',
    type: 'Full-time',
    remote: true,
    description: 'Shape product experiences from concept to launch. Work closely with engineering and product teams.',
    requirements: ['Figma Expert', 'User Research', 'Prototyping', 'Design Systems'],
    accent: '#E9FAF7'
  },
  {
    id: 3,
    title: 'Full Stack Engineer',
    company: 'StartupX',
    location: 'Austin, TX',
    salary: '$130k - $160k',
    type: 'Full-time',
    remote: false,
    description: 'Join our fast-growing team to build scalable backend services and intuitive frontend interfaces.',
    requirements: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    accent: '#FFF8DA'
  },
  {
    id: 4,
    title: 'UX Researcher',
    company: 'UserFirst Labs',
    location: 'Seattle, WA',
    salary: '$110k - $140k',
    type: 'Full-time',
    remote: true,
    description: 'Lead user research initiatives to uncover insights that drive product decisions and improve user satisfaction.',
    requirements: ['Qualitative Research', 'Usability Testing', 'Data Analysis', 'Stakeholder Presentation'],
    accent: '#E6F0FF'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudScale Systems',
    location: 'Denver, CO',
    salary: '$145k - $175k',
    type: 'Full-time',
    remote: true,
    description: 'Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability at scale.',
    requirements: ['Kubernetes', 'Terraform', 'AWS/GCP', 'Python/Go'],
    accent: '#F0E6FF'
  }
]

export default function JobSwipe() {
  const [jobs, setJobs] = useState(dummyJobs)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [savedJobs, setSavedJobs] = useState([])
  const [passedJobs, setPassedJobs] = useState([])
  const cardRef = useRef(null)
  const startX = useRef(0)
  const isDragging = useRef(false)

  const currentJob = jobs[currentIndex]

  const handleSwipe = (direction) => {
    setSwipeDirection(direction)
    
    setTimeout(() => {
      if (direction === 'right') {
        setSavedJobs(prev => [...prev, currentJob])
      } else {
        setPassedJobs(prev => [...prev, currentJob])
      }
      
      setSwipeDirection(null)
      setDragOffset(0)
      
      if (currentIndex < jobs.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setCurrentIndex(0)
        setJobs(dummyJobs)
      }
    }, 300)
  }

  const handleMouseDown = (e) => {
    isDragging.current = true
    startX.current = e.clientX
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    const diff = e.clientX - startX.current
    setDragOffset(diff)
  }

  const handleMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    
    if (dragOffset > 100) {
      handleSwipe('right')
    } else if (dragOffset < -100) {
      handleSwipe('left')
    } else {
      setDragOffset(0)
    }
  }

  const handleTouchStart = (e) => {
    isDragging.current = true
    startX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    if (!isDragging.current) return
    const diff = e.touches[0].clientX - startX.current
    setDragOffset(diff)
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  const getCardStyle = () => {
    let transform = `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`
    let opacity = 1
    let transition = 'none'

    if (swipeDirection === 'left') {
      transform = 'translateX(-500px) rotate(-30deg)'
      opacity = 0
      transition = 'all 0.3s ease-out'
    } else if (swipeDirection === 'right') {
      transform = 'translateX(500px) rotate(30deg)'
      opacity = 0
      transition = 'all 0.3s ease-out'
    } else if (!isDragging.current && dragOffset === 0) {
      transition = 'all 0.2s ease-out'
    }

    return { transform, opacity, transition }
  }

  if (!currentJob) {
    return (
      <div className="swipe-empty">
        <div className="swipe-empty-text">No more jobs to swipe!</div>
        <button 
          className="primary-button" 
          onClick={() => { setCurrentIndex(0); setJobs(dummyJobs) }}
        >
          <span className="primary-button-text">Start Over</span>
        </button>
      </div>
    )
  }

  return (
    <div className="swipe-container">
      <div className="swipe-stats">
        <div className="stat-item stat-saved">
          <span className="stat-count">{savedJobs.length}</span>
          <span className="stat-label">Saved</span>
        </div>
        <div className="stat-item stat-remaining">
          <span className="stat-count">{jobs.length - currentIndex}</span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat-item stat-passed">
          <span className="stat-count">{passedJobs.length}</span>
          <span className="stat-label">Passed</span>
        </div>
      </div>

      <div className="swipe-deck">
        {/* Background card for depth effect */}
        {currentIndex < jobs.length - 1 && (
          <div className="job-card job-card-back" style={{ backgroundColor: jobs[currentIndex + 1]?.accent }}>
            <div className="job-header">
              <div className="job-title">{jobs[currentIndex + 1]?.title}</div>
              <div className="job-company">{jobs[currentIndex + 1]?.company}</div>
            </div>
          </div>
        )}

        {/* Main swipeable card */}
        <div
          ref={cardRef}
          className="job-card"
          style={{ ...getCardStyle(), backgroundColor: currentJob.accent }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe indicators */}
          <div 
            className="swipe-indicator swipe-like" 
            style={{ opacity: Math.min(dragOffset / 100, 1) }}
          >
            SAVE ✓
          </div>
          <div 
            className="swipe-indicator swipe-pass" 
            style={{ opacity: Math.min(-dragOffset / 100, 1) }}
          >
            PASS ✗
          </div>

          <div className="job-header">
            <div className="job-title">{currentJob.title}</div>
            <div className="job-company">{currentJob.company}</div>
            <div className="job-meta">
              <span className="job-location">📍 {currentJob.location}</span>
              {currentJob.remote && <span className="job-remote">🏠 Remote</span>}
            </div>
          </div>

          <div className="job-salary">{currentJob.salary}</div>

          <div className="job-description">{currentJob.description}</div>

          <div className="job-requirements">
            <div className="requirements-title">Requirements</div>
            <div className="requirements-list">
              {currentJob.requirements.map((req, i) => (
                <span key={i} className="requirement-tag">{req}</span>
              ))}
            </div>
          </div>

          <div className="swipe-hint">← Swipe left to pass | Swipe right to save →</div>
        </div>
      </div>

      <div className="swipe-buttons">
        <button className="swipe-btn swipe-btn-pass" onClick={() => handleSwipe('left')}>
          ✗ Pass
        </button>
        <button className="swipe-btn swipe-btn-save" onClick={() => handleSwipe('right')}>
          ✓ Save
        </button>
      </div>

      {savedJobs.length > 0 && (
        <div className="saved-jobs">
          <div className="saved-title">Saved Jobs ({savedJobs.length})</div>
          <div className="saved-list">
            {savedJobs.map(job => (
              <div key={job.id} className="saved-item" style={{ backgroundColor: job.accent }}>
                <div className="saved-job-title">{job.title}</div>
                <div className="saved-job-company">{job.company}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
