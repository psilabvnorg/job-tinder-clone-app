import { useState, useRef, useCallback, useEffect } from 'react'
import { useJobs } from '../hooks/useJobs'

// SVG Icons
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const DISTANCE_THRESHOLD = 110
const VELOCITY_THRESHOLD = 0.5
const COMMIT_ANIMATION_MS = 280

export default function JobSwipe({ onSwipeLeft, onSwipeRight }) {
  const {
    jobs,
    loading,
    source,
    categories,
    locations,
    categoryFilter,
    locationFilter,
    setCategoryFilter,
    setLocationFilter,
  } = useJobs()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [deltaX, setDeltaX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragAxis, setDragAxis] = useState(null)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const scrollRef = useRef(null)
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    startTime: 0,
  })
  const dragAxisRef = useRef(null)
  const advanceTimerRef = useRef(null)

  const currentJob = currentIndex < jobs.length ? jobs[currentIndex] : null
  const requirements = Array.isArray(currentJob?.requirements)
    ? currentJob.requirements
    : currentJob?.requirements
      ? [currentJob.requirements]
      : []
  const activeFilterCount = (categoryFilter ? 1 : 0) + (locationFilter ? 1 : 0)

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
  }, [])

  const resetDragState = useCallback(() => {
    setIsDragging(false)
    setDragAxis(null)
    dragAxisRef.current = null
    dragRef.current.pointerId = null
    dragRef.current.startX = 0
    dragRef.current.startY = 0
    dragRef.current.startTime = 0
  }, [])

  const advanceCard = useCallback(() => {
    setCurrentIndex((prev) => {
      if (jobs.length === 0) return 0
      const next = prev + 1
      return next > jobs.length ? jobs.length : next
    })
  }, [jobs.length])

  const commitSwipe = useCallback((direction, { animate = true } = {}) => {
    if (!currentJob || isAnimatingOut) return

    if (direction === 'right') {
      onSwipeRight?.(currentJob)
    } else {
      onSwipeLeft?.(currentJob)
    }

    if (!animate) {
      setDeltaX(0)
      advanceCard()
      return
    }

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
    const throwX = direction === 'right' ? viewportWidth * 1.2 : -viewportWidth * 1.2
    setIsAnimatingOut(true)
    setDeltaX(throwX)
    clearAdvanceTimer()
    advanceTimerRef.current = setTimeout(() => {
      advanceCard()
      setDeltaX(0)
      setIsAnimatingOut(false)
      advanceTimerRef.current = null
    }, COMMIT_ANIMATION_MS)
  }, [advanceCard, clearAdvanceTimer, currentJob, isAnimatingOut, onSwipeLeft, onSwipeRight])

  useEffect(() => {
    clearAdvanceTimer()
    setCurrentIndex(0)
    setDeltaX(0)
    setIsAnimatingOut(false)
    resetDragState()
  }, [categoryFilter, locationFilter, clearAdvanceTimer, resetDragState])

  useEffect(() => {
    setShowDetails(false)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [currentJob?.id])

  useEffect(() => () => clearAdvanceTimer(), [clearAdvanceTimer])

  const handlePointerDown = useCallback((event) => {
    if (!currentJob || isAnimatingOut) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    dragRef.current.pointerId = event.pointerId
    dragRef.current.startX = event.clientX
    dragRef.current.startY = event.clientY
    dragRef.current.startTime = Date.now()
    setDeltaX(0)
    setIsDragging(true)
    setDragAxis(null)
    dragAxisRef.current = null

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }, [currentJob, isAnimatingOut])

  const handlePointerMove = useCallback((event) => {
    if (!isDragging || dragRef.current.pointerId !== event.pointerId || isAnimatingOut) return

    const deltaMoveX = event.clientX - dragRef.current.startX
    const deltaMoveY = event.clientY - dragRef.current.startY

    if (!dragAxisRef.current) {
      if (Math.abs(deltaMoveX) < 8 && Math.abs(deltaMoveY) < 8) return
      const nextAxis = Math.abs(deltaMoveX) > Math.abs(deltaMoveY) * 1.1 ? 'horizontal' : 'vertical'
      dragAxisRef.current = nextAxis
      setDragAxis(nextAxis)
      return
    }

    if (dragAxisRef.current === 'vertical') return

    event.preventDefault()
    const maxOffset = (typeof window !== 'undefined' ? window.innerWidth : 1000) * 1.25
    const boundedOffset = Math.max(-maxOffset, Math.min(maxOffset, deltaMoveX))
    setDeltaX(boundedOffset)
  }, [isAnimatingOut, isDragging])

  const finishPointerInteraction = useCallback((event, isCancelled = false) => {
    if (!isDragging || dragRef.current.pointerId !== event.pointerId) return

    if (event.currentTarget.releasePointerCapture) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (isCancelled) {
      setDeltaX(0)
      resetDragState()
      return
    }

    if (dragAxisRef.current !== 'horizontal') {
      setDeltaX(0)
      resetDragState()
      return
    }

    const finalDeltaX = event.clientX - dragRef.current.startX
    const elapsed = Math.max(1, Date.now() - dragRef.current.startTime)
    const velocityX = finalDeltaX / elapsed
    const passThreshold =
      Math.abs(finalDeltaX) >= DISTANCE_THRESHOLD || Math.abs(velocityX) >= VELOCITY_THRESHOLD

    if (passThreshold) {
      commitSwipe(finalDeltaX >= 0 ? 'right' : 'left')
    } else {
      setDeltaX(0)
    }

    resetDragState()
  }, [commitSwipe, isDragging, resetDragState])

  const handlePointerUp = useCallback((event) => {
    finishPointerInteraction(event, false)
  }, [finishPointerInteraction])

  const handlePointerCancel = useCallback((event) => {
    finishPointerInteraction(event, true)
  }, [finishPointerInteraction])

  const handleSkip = useCallback(() => {
    commitSwipe('left')
  }, [commitSwipe])

  const handleSave = useCallback(() => {
    commitSwipe('right')
  }, [commitSwipe])

  const handleScroll = useCallback((event) => {
    const scrollTop = event.currentTarget.scrollTop
    setShowDetails(scrollTop > 60)
  }, [])

  const handleShowDetails = useCallback(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    setShowDetails(true)
  }, [])

  const handleDeckWheel = useCallback((event) => {
    if (!scrollRef.current) return
    if (isDragging && dragAxis === 'horizontal') return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

    const scrollElement = scrollRef.current
    if (scrollElement.scrollHeight <= scrollElement.clientHeight) return

    event.preventDefault()
    scrollElement.scrollTop += event.deltaY
    setShowDetails(scrollElement.scrollTop > 60)
  }, [dragAxis, isDragging])

  const swipeDirection = deltaX > 30 ? 'right' : deltaX < -30 ? 'left' : null
  const swipeProgress = Math.min(1, Math.abs(deltaX) / DISTANCE_THRESHOLD)
  const rotation = Math.max(-18, Math.min(18, deltaX / 14))

  const cardStyle = {
    transform: `translateX(${deltaX}px) rotate(${rotation}deg)`,
    transition:
      isDragging && dragAxis === 'horizontal'
        ? 'none'
        : isAnimatingOut
          ? `transform ${COMMIT_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
          : 'transform 240ms ease-out',
  }

  const renderFilterControls = (withInfo) => (
    <>
      <div className="filter-bar">
        <button
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <FilterIcon />
          <span>Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
        </button>
        {withInfo && (
          <div className="filter-info">
            {jobs.length} việc làm
          </div>
        )}
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label className="filter-label">
              <BriefcaseIcon />
              <span>Ngành nghề</span>
            </label>
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">Tất cả ngành nghề</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <MapPinIcon />
              <span>Địa điểm</span>
            </label>
            <select
              className="filter-select"
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            >
              <option value="">Tất cả địa điểm</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {activeFilterCount > 0 && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setCategoryFilter('')
                setLocationFilter('')
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}
    </>
  )

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
      <div className="swipe-view">
        {renderFilterControls(false)}
        <div className="empty-state">
          <HeartIcon />
          <div className="empty-state-title">Hết việc để xem!</div>
          <div className="empty-state-text">
            {activeFilterCount > 0
              ? 'Thử thay đổi bộ lọc để xem thêm việc làm'
              : 'Quay lại sau để xem cơ hội mới'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="swipe-view">
      {renderFilterControls(true)}

      <div className="swipe-deck-container" onWheel={handleDeckWheel}>
        <div className="swipe-deck">
          {jobs.slice(currentIndex + 1, currentIndex + 3).map((job, index) => (
            <div
              key={job.id}
              className="card-stack-bg"
              style={{
                transform: `scale(${0.95 - index * 0.03}) translateY(${(index + 1) * 8}px)`,
                zIndex: -index - 1,
              }}
            />
          ))}

          <div
            className={`job-card ${dragAxis === 'horizontal' ? 'drag-horizontal' : ''} ${isAnimatingOut ? 'is-committing' : ''}`}
            style={cardStyle}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <div
              className="job-card-bg"
              style={{ backgroundImage: `url(${currentJob.backgroundImage})` }}
            />
            <div className="job-card-overlay" />

            {swipeDirection === 'right' && (
              <div
                className="swipe-indicator save"
                style={{ opacity: swipeProgress, transform: `rotate(-15deg) scale(${0.85 + swipeProgress * 0.15})` }}
              >
                LƯU
              </div>
            )}
            {swipeDirection === 'left' && (
              <div
                className="swipe-indicator pass"
                style={{ opacity: swipeProgress, transform: `rotate(15deg) scale(${0.85 + swipeProgress * 0.15})` }}
              >
                BỎ QUA
              </div>
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
                      {requirements.map((req, index) => (
                        <span key={`${req}-${index}`} className="requirement-tag">{req}</span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="swipe-hint"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleShowDetails()
                    }}
                  >
                    <ChevronDownIcon />
                    <span>Kéo xuống để xem chi tiết</span>
                  </button>
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
                        {requirements.map((req, index) => (
                          <li key={`${req}-detail-${index}`}>{req}</li>
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

      <div className="action-buttons">
        <button
          className="action-btn pass"
          onClick={handleSkip}
          disabled={!currentJob || isAnimatingOut}
        >
          <XIcon />
        </button>

        <button
          className="action-btn info"
          onClick={handleShowDetails}
          disabled={!currentJob || isAnimatingOut}
        >
          <InfoIcon />
        </button>

        <button
          className="action-btn save"
          onClick={handleSave}
          disabled={!currentJob || isAnimatingOut}
        >
          <HeartIcon />
        </button>
      </div>
    </div>
  )
}
