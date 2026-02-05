import { useState, useRef, useCallback, useEffect } from 'react'
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
  const [showDetails, setShowDetails] = useState(false)
  
  const startX = useRef(0)
  const scrollRef = useRef(null)
  const threshold = 100

  const currentJob = jobs[currentIndex]
  const requirements = Array.isArray(currentJob?.requirements)
    ? currentJob.requirements
    : currentJob?.requirements
      ? [currentJob.requirements]
      : []

  useEffect(() => {
    setShowDetails(false)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [currentJob?.id])

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

  const handleScroll = (event) => {
    const scrollTop = event.currentTarget.scrollTop
    setShowDetails(scrollTop > 60)
  }

  const handleShowDetails = () => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    setShowDetails(true)
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
        <div className="empty-state-title">Đang tải việc làm...</div>
        <div className="empty-state-text">Đang lấy từ {source || 'cơ sở dữ liệu'}</div>
      </div>
    )
  }

  if (!currentJob) {
    return (
      <div className="empty-state">
        <HeartIcon />
        <div className="empty-state-title">Hết việc để xem!</div>
        <div className="empty-state-text">Quay lại sau để xem cơ hội mới</div>
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
              <div className="swipe-indicator save">LƯU</div>
            )}
            {swipeDirection === 'left' && (
              <div className="swipe-indicator pass">BỎ QUA</div>
            )}

            <div className="job-card-content">
              <div className="job-card-scroll" onScroll={handleScroll} ref={scrollRef}>
                <div className="job-card-summary">
                  <div className="job-badges">
                    <span className="job-badge salary">{currentJob.salary}</span>
                    {currentJob.remote && <span className="job-badge remote">Làm việc từ xa</span>}
                    <span className="job-badge">{currentJob.type}</span>
                  </div>

                  <h2 className="job-card-title">{currentJob.title}</h2>
                  <div className="job-card-company">{currentJob.company}</div>
                  <div className="job-card-location">📍 {currentJob.location}</div>

                  <p className="job-card-description">{currentJob.description}</p>

                  {requirements.length > 0 && (
                    <div className="job-requirements">
                      {requirements.map((req, i) => (
                        <span key={`${req}-${i}`} className="requirement-tag">{req}</span>
                      ))}
                    </div>
                  )}

                  <div className="swipe-hint">
                    <ChevronDownIcon />
                    <span>Kéo xuống để xem chi tiết</span>
                  </div>
                </div>

                <div className={`job-card-details ${showDetails ? 'visible' : ''}`}>
                  <div className="detail-title">Chi tiết công việc</div>
                  <div className="detail-section">
                    <div className="detail-label">Mô tả</div>
                    <p className="detail-text">{currentJob.description || 'Chưa có mô tả chi tiết.'}</p>
                  </div>
                  <div className="detail-section">
                    <div className="detail-label">Yêu cầu</div>
                    {requirements.length > 0 ? (
                      <ul className="detail-list">
                        {requirements.map((req, i) => (
                          <li key={`${req}-detail-${i}`}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="detail-text">Chưa cập nhật yêu cầu.</p>
                    )}
                  </div>
                  <div className="detail-section detail-meta">
                    <div>
                      <div className="detail-label">Nguồn</div>
                      <div className="detail-chip">{currentJob.source || 'Nội bộ'}</div>
                    </div>
                    <div>
                      <div className="detail-label">Hình thức</div>
                      <div className="detail-chip">{currentJob.type}</div>
                    </div>
                  </div>
                  {currentJob.url && (
                    <a className="detail-link" href={currentJob.url} target="_blank" rel="noreferrer">
                      Xem tin tuyển dụng
                    </a>
                  )}
                </div>
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
          onClick={handleShowDetails}
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
