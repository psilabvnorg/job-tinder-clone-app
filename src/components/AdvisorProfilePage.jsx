const advisorHighlights = [
  { label: 'Bài học', value: '48' },
  { label: 'Mentoring', value: '120h' },
  { label: 'Rating', value: '4.9' }
]

const chatStreams = [
  {
    id: 'edugram',
    title: 'Edugram Mentor Chat',
    subtitle: 'Hỏi về lộ trình học, portfolio, mindset.',
    messages: [
      { role: 'mentor', text: 'Bạn muốn tập trung vào UX research hay product strategy?' },
      { role: 'user', text: 'Mình muốn cải thiện UX research để làm case study.' },
      { role: 'mentor', text: 'Hãy bắt đầu từ kế hoạch phỏng vấn và tổng hợp insight.' }
    ]
  },
  {
    id: 'jobswipe',
    title: 'JobSwipe Career Chat',
    subtitle: 'Chỉnh CV, luyện phỏng vấn, tối ưu ATS.',
    messages: [
      { role: 'coach', text: 'Gửi mình bullet mạnh nhất bạn đang có.' },
      { role: 'user', text: 'Dẫn dắt onboarding, tăng activation 26%.' },
      { role: 'coach', text: 'Tuyệt! Hãy thêm bối cảnh và phạm vi dự án.' }
    ]
  }
]

export default function AdvisorProfilePage() {
  return (
    <div className="advisor-profile-view">
      <div className="advisor-profile-card">
        <div className="advisor-profile-top">
          <div className="advisor-avatar-large">EA</div>
          <div>
            <h2>Emilia Anh</h2>
            <p>Lead Mentor • Edugram</p>
            <div className="advisor-tags">
              <span>UX Strategy</span>
              <span>Storytelling</span>
              <span>Career Coach</span>
            </div>
          </div>
          <button className="advisor-primary-btn">Đặt lịch chat</button>
        </div>
        <div className="advisor-highlight-grid">
          {advisorHighlights.map((item) => (
            <div key={item.label} className="advisor-highlight">
              <div className="highlight-value">{item.value}</div>
              <div className="highlight-label">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="advisor-bio">
          Hỗ trợ xây dựng chiến lược sự nghiệp, cải thiện storytelling trong portfolio và tối ưu hóa trải nghiệm ứng tuyển.
        </p>
      </div>

      <div className="advisor-chat-grid">
        {chatStreams.map((stream) => (
          <div key={stream.id} className="advisor-chat-card">
            <div className="advisor-chat-header">
              <div>
                <div className="advisor-chat-title">{stream.title}</div>
                <div className="advisor-chat-sub">{stream.subtitle}</div>
              </div>
              <button className="advisor-chat-btn">Mở chat</button>
            </div>
            <div className="advisor-chat-log">
              {stream.messages.map((message, index) => (
                <div
                  key={`${stream.id}-${index}`}
                  className={`advisor-chat-bubble ${message.role === 'user' ? 'user' : 'mentor'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
