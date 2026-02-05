import { useState, useRef, useCallback } from 'react'
import { useJobs } from '../hooks/useJobs'

// SVG Icons
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
)

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4M12 8h.01"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="m6 9 6 6 6-6"/>
  </svg>
)

export default function JobSwipe({ onSwipeLeft, onSwipeRight, onViewDetails }) {
  const { jobs, loading, source } = useJobs()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [deltaX, setDeltaX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  
  const startX = useRef(0)
  const threshold = 100

  const currentJob = jobs[currentIndex]

  const handleStart = useCallback((clientX) => {
    setIsDragging(true)
    startX.current = clientX
  }, [])

  const handleMove = useCallback((clientX) => {
    if (!isDragging) return
    const diff = clientX - startX.current
    setDeltaX(diff)
  }, [isDragging])

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    if (deltaX > threshold) {
      // Swipe right - Save
      onSwipeRight?.(currentJob)
      setCurrentIndex((prev) => (prev + 1) % jobs.length)
    } else if (deltaX < -threshold) {
      // Swipe left - Pass
      onSwipeLeft?.(currentJob)
      setCurrentIndex((prev) => (prev + 1) % jobs.length)
    }
    
    setDeltaX(0)
  }, [isDragging, deltaX, currentJob, jobs.length, onSwipeLeft, onSwipeRight])

  const handleMouseDown = (e) => handleStart(e.clientX)
  const handleMouseMove = (e) => handleMove(e.clientX)
  const handleMouseUp = () => handleEnd()
  const handleMouseLeave = () => { if (isDragging) handleEnd() }

  const handleTouchStart = (e) => handleStart(e.touches[0].clientX)
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX)
  const handleTouchEnd = () => handleEnd()

  const handleSkip = () => {
    onSwipeLeft?.(currentJob)
    setCurrentIndex((prev) => (prev + 1) % jobs.length)
  }

  const handleSave = () => {
    onSwipeRight?.(currentJob)
    setCurrentIndex((prev) => (prev + 1) % jobs.length)
  }

  const rotation = deltaX / 20
  const swipeDirection = deltaX > 50 ? 'right' : deltaX < -50 ? 'left' : null

  const cardStyle = {
    transform: `translateX(${deltaX}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Loading jobs...</div>
        <div className="empty-state-text">Fetching from {source || 'database'}</div>
      </div>
    )
  }

  if (!currentJob) {
    return (
      <div className="empty-state">
        <HeartIcon />
        <div className="empty-state-title">No more jobs!</div>
        <div className="empty-state-text">Check back later for new opportunities</div>
      </div>
    )
  }

  return (
    <div className="swipe-view">
      <div className="swipe-deck-container">
        <div className="swipe-deck">
          {/* Background cards for stack effect */}
          {jobs.slice(currentIndex + 1, currentIndex + 3).map((job, i) => (
            <div
              key={job.id}
              className="card-stack-bg"
              style={{
                transform: `scale(${0.95 - i * 0.03}) translateY(${(i + 1) * 8}px)`,
                zIndex: -i - 1,
              }}
            />
          ))}

          {/* Active card */}
          <div
            className={`job-card ${!currentJob ? 'inactive' : ''}`}
            style={cardStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="job-card-bg"
              style={{ backgroundImage: `url(${currentJob.backgroundImage})` }}
            />
            <div className="job-card-overlay" />

            {/* Swipe indicators */}
            {swipeDirection === 'right' && (
              <div className="swipe-indicator save">SAVE</div>
            )}
            {swipeDirection === 'left' && (
              <div className="swipe-indicator pass">PASS</div>
            )}

            <div className="job-card-content">
              <div className="job-badges">
                <span className="job-badge salary">{currentJob.salary}</span>
                {currentJob.remote && <span className="job-badge remote">Remote</span>}
                <span className="job-badge">{currentJob.type}</span>
              </div>

              <h2 className="job-card-title">{currentJob.title}</h2>
              <div className="job-card-company">{currentJob.company}</div>
              <div className="job-card-location">📍 {currentJob.location}</div>

              <p className="job-card-description">{currentJob.description}</p>

              <div className="job-requirements">
                {currentJob.requirements.map((req, i) => (
                  <span key={i} className="requirement-tag">{req}</span>
                ))}
              </div>

              <div className="swipe-hint">
                <ChevronDownIcon />
                <span>Swipe to decide</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="action-btn pass"
          onClick={handleSkip}
          disabled={!currentJob}
        >
          <XIcon />
        </button>
        
        <button
          className="action-btn info"
          onClick={() => onViewDetails?.(currentJob)}
          disabled={!currentJob}
        >
          <InfoIcon />
        </button>
        
        <button
          className="action-btn save"
          onClick={handleSave}
          disabled={!currentJob}
        >
          <HeartIcon />
        </button>
      </div>
    </div>
  )
}
