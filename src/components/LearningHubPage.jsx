import { useState, useEffect } from 'react'
import { getPracticeQuestions } from '../services/database'

const focusSteps = [
  { title: 'Warm-up recap', description: "Review yesterday's notes and save 1 key insight.", duration: '5 min' },
  { title: 'Deep dive', description: 'Watch a focused lesson and write a 3-line summary.', duration: '15 min' },
  { title: 'Practice sprint', description: 'Apply the idea in a quick quiz or exercise.', duration: '10 min' },
]

const exploreTracks = [
  { id: 1, title: 'Design Thinking', lessons: 12, level: 'Cơ bản', color: 'lavender', description: 'Khung tư duy để giải quyết bài toán người dùng.' },
  { id: 2, title: 'Product Strategy', lessons: 8, level: 'Trung cấp', color: 'peach', description: 'Học cách đặt roadmap và ưu tiên dự án.' },
  { id: 3, title: 'UX Research', lessons: 10, level: 'Trung cấp', color: 'mint', description: 'Kỹ thuật phỏng vấn và tổng hợp insight.' },
  { id: 4, title: 'Portfolio Stories', lessons: 6, level: 'Nâng cao', color: 'sky', description: 'Kể chuyện kết quả để chinh phục recruiter.' }
]

const practiceSessions = [
  { id: 1, title: 'Thử thách 7 ngày cải thiện CV', time: '20 phút/ngày', progress: 65, tasks: ['Viết lại summary', 'Thêm số liệu', 'Tối ưu kỹ năng'] },
  { id: 2, title: 'Case study: App giao đồ ăn', time: '2 giờ', progress: 30, tasks: ['Mapping journey', 'Wireframe flow', 'Đo lường KPI'] },
  { id: 3, title: 'Mock interview UX', time: '45 phút', progress: 80, tasks: ['Chuẩn bị story', 'Thử trả lời', 'Nhận feedback'] }
]

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

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

function FocusSprint() {
  return (
    <section className="edu-sprint">
      <div className="edu-sprint-header">
        <div>
          <p className="edu-sprint-label">Focus Sprint</p>
          <h2 className="edu-sprint-title">25-minute learning plan</h2>
          <p className="edu-sprint-subtitle">Stay consistent with a guided micro-session.</p>
        </div>
        <div className="edu-sprint-meta">
          <div className="edu-sprint-goal">
            <p className="edu-sprint-goal-label">Today's goal</p>
            <p className="edu-sprint-goal-value">1 lesson + 1 quiz</p>
          </div>
          <span className="edu-sprint-badge">80% ready</span>
        </div>
      </div>

      <div className="edu-sprint-steps">
        {focusSteps.map((step, i) => (
          <div key={step.title} className="edu-sprint-step">
            <div className="edu-sprint-step-num">{i + 1}</div>
            <div className="edu-sprint-step-content">
              <div className="edu-sprint-step-header">
                <p className="edu-sprint-step-title">{step.title}</p>
                <span className="edu-sprint-step-duration">{step.duration}</span>
              </div>
              <p className="edu-sprint-step-desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="edu-sprint-footer">
        <div className="edu-sprint-progress">
          <div className="edu-sprint-progress-bar">
            <div className="edu-sprint-progress-fill" style={{ width: '60%' }} />
          </div>
          <p className="edu-sprint-progress-text">3 of 5 weekly sessions completed</p>
        </div>
        <button className="edu-sprint-btn">Start sprint</button>
      </div>
    </section>
  )
}

function PracticeCarousel({ practiceQuestions }) {
  const [selections, setSelections] = useState({})

  const handleSelect = (questionId, optionId) => {
    setSelections(prev => ({ ...prev, [questionId]: optionId }))
  }

  if (!practiceQuestions.length) {
    return null
  }

  return (
    <section className="edu-practice">
      <div className="edu-practice-header">
        <div>
          <p className="edu-practice-label">Practice</p>
          <h2 className="edu-practice-title">Swipeable quick checks</h2>
          <p className="edu-practice-subtitle">Answer a 10-second quiz, then explain your reasoning in comments.</p>
        </div>
        <div className="edu-practice-hint">
          <HelpIcon />
          Swipe to explore
        </div>
      </div>

      <div className="edu-practice-cards">
        {practiceQuestions.map((question) => {
          const selected = selections[question.id]
          const isCorrect = selected === question.correctOptionId
          return (
            <div key={question.id} className="edu-practice-card">
              <div className="edu-practice-image">
                <img src={question.image} alt={question.title} />
              </div>
              <div className="edu-practice-content">
                <p className="edu-practice-topic">{question.title}</p>
                <p className="edu-practice-question">{question.question}</p>
                <div className="edu-practice-options">
                  {question.options.map((option) => {
                    const isSelected = selected === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(question.id, option.id)}
                        className={`edu-practice-option ${isSelected ? 'selected' : ''}`}
                      >
                        <span className="edu-practice-option-label">{option.label}</span>
                        <span className="edu-practice-option-text">{option.text}</span>
                      </button>
                    )
                  })}
                </div>
                {selected && (
                  <div className={`edu-practice-result ${isCorrect ? 'correct' : 'wrong'}`}>
                    <span className="edu-practice-result-icon">
                      {isCorrect ? <CheckIcon /> : <XIcon />}
                    </span>
                    <div>
                      <p className="edu-practice-result-title">{isCorrect ? 'Nice work!' : 'Close — try again.'}</p>
                      <p className="edu-practice-result-text">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function LearningHubPage() {
  const [practiceQuestions, setPracticeQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const questions = await getPracticeQuestions()
        setPracticeQuestions(questions)
      } catch (err) {
        console.error('Error loading practice questions:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="learning-view"><p style={{ padding: '2rem', textAlign: 'center' }}>Loading...</p></div>
  }

  return (
    <div className="learning-view">
      <div className="learning-hero">
        <div>
          <h2 className="learning-title">Learning Hub</h2>
          <p className="learning-subtitle">Kết hợp Explore + Practice theo phong cách Edugram</p>
        </div>
        <div className="learning-cta">
          <button className="learning-button">Bắt đầu hôm nay</button>
          <span className="learning-streak">🔥 Streak 5 ngày</span>
        </div>
      </div>

      <FocusSprint />
      <PracticeCarousel practiceQuestions={practiceQuestions} />

      <section className="learning-section">
        <div className="section-header">
          <h3>Explore Edugram</h3>
          <button className="section-link">Xem tất cả</button>
        </div>
        <div className="explore-grid">
          {exploreTracks.map((track) => (
            <div key={track.id} className={`explore-card ${track.color}`}>
              <div className="explore-title">{track.title}</div>
              <div className="explore-meta">{track.lessons} bài học • {track.level}</div>
              <p className="explore-desc">{track.description}</p>
              <button className="explore-button">Vào học</button>
            </div>
          ))}
        </div>
      </section>

      <section className="learning-section">
        <div className="section-header">
          <h3>Practice Edugram</h3>
          <button className="section-link">Tạo kế hoạch</button>
        </div>
        <div className="practice-list">
          {practiceSessions.map((session) => (
            <div key={session.id} className="practice-card">
              <div className="practice-header">
                <div>
                  <div className="practice-title">{session.title}</div>
                  <div className="practice-time">{session.time}</div>
                </div>
                <span className="practice-progress">{session.progress}%</span>
              </div>
              <div className="practice-bar">
                <div className="practice-fill" style={{ width: `${session.progress}%` }} />
              </div>
              <div className="practice-tasks">
                {session.tasks.map((task) => (
                  <span key={task} className="practice-chip">✓ {task}</span>
                ))}
              </div>
              <button className="practice-button">Tiếp tục luyện tập</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
