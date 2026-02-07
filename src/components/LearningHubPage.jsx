const exploreTracks = [
  {
    id: 1,
    title: 'Design Thinking',
    lessons: 12,
    level: 'Cơ bản',
    color: 'lavender',
    description: 'Khung tư duy để giải quyết bài toán người dùng.'
  },
  {
    id: 2,
    title: 'Product Strategy',
    lessons: 8,
    level: 'Trung cấp',
    color: 'peach',
    description: 'Học cách đặt roadmap và ưu tiên dự án.'
  },
  {
    id: 3,
    title: 'UX Research',
    lessons: 10,
    level: 'Trung cấp',
    color: 'mint',
    description: 'Kỹ thuật phỏng vấn và tổng hợp insight.'
  },
  {
    id: 4,
    title: 'Portfolio Stories',
    lessons: 6,
    level: 'Nâng cao',
    color: 'sky',
    description: 'Kể chuyện kết quả để chinh phục recruiter.'
  }
]

const practiceSessions = [
  {
    id: 1,
    title: 'Thử thách 7 ngày cải thiện CV',
    time: '20 phút/ngày',
    progress: 65,
    tasks: ['Viết lại summary', 'Thêm số liệu', 'Tối ưu kỹ năng']
  },
  {
    id: 2,
    title: 'Case study: App giao đồ ăn',
    time: '2 giờ',
    progress: 30,
    tasks: ['Mapping journey', 'Wireframe flow', 'Đo lường KPI']
  },
  {
    id: 3,
    title: 'Mock interview UX',
    time: '45 phút',
    progress: 80,
    tasks: ['Chuẩn bị story', 'Thử trả lời', 'Nhận feedback']
  }
]

export default function LearningHubPage() {
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
