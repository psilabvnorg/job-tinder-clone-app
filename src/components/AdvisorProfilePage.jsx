import { useState, useMemo } from 'react'

// ===== ADVISOR DATA =====
const advisors = [
  {
    name: 'Steve Jobs',
    title: 'Nhà tiên phong sản phẩm',
    style: 'Tập trung vào sự rõ ràng, đơn giản và kể chuyện.',
    headline: 'Thiết kế sự nghiệp như một màn ra mắt sản phẩm.',
    summary: 'Ám ảnh với trải nghiệm bạn tạo cho người dùng. Loại bỏ mọi thứ không thiết yếu. Xây dựng câu chuyện sự nghiệp khiến người khác cảm nhận được.',
    focus: [
      'Tạo portfolio kể một câu chuyện rõ ràng.',
      'Ưu tiên vai trò cho phép tay nghề đi sâu.',
      'Nói không với xao nhãng để tạo ra tác phẩm đỉnh cao.'
    ],
    voice: [
      'Thách thức nhưng truyền cảm hứng.',
      'Khuyến khích đặt cược táo bạo và quyết định theo gu.',
      'Đẩy sự đơn giản, không thỏa hiệp.'
    ],
    accent: '#FFE9E6',
    quote: '"Hãy khao khát. Hãy dại khờ."',
    badge: 'Bậc thầy tối giản',
    image: '/image/steve-jobs.jpg'
  },
  {
    name: 'Warren Buffett',
    title: 'Chiến lược gia dài hạn',
    style: 'Tạo giá trị cộng dồn bằng kiên nhẫn và niềm tin.',
    headline: 'Đầu tư vào bản thân trước mọi vai trò.',
    summary: 'Chọn công ty có văn hóa bền vững và lãnh đạo tôn trọng tay nghề. Tập trung tăng trưởng ổn định, không chạy theo hào nhoáng.',
    focus: [
      'Đào sâu nền tảng và kỹ năng giao tiếp.',
      'Chọn người hướng dẫn chính trực, tầm nhìn dài hạn.',
      'Ra quyết định nghề nghiệp giúp cộng dồn quan hệ.'
    ],
    voice: [
      'Điềm tĩnh, chừng mực và thực tế.',
      'Đề cao sự ổn định hơn hào nhoáng.',
      'Khuyến khích xây dựng danh tiếng.'
    ],
    accent: '#FFF8DA',
    quote: '"Khoản đầu tư tốt nhất là đầu tư vào bản thân."',
    badge: 'Bậc thầy đường dài',
    image: '/image/warren-buffet.jpg'
  },
  {
    name: 'Elon Musk',
    title: 'Nhà xây dựng nguyên lý gốc',
    style: 'Tham vọng, kỹ thuật và ám ảnh sứ mệnh.',
    headline: 'Chọn bài toán khó nhất và đi thật nhanh.',
    summary: 'Nếu sứ mệnh khiến bạn hứng khởi, hãy bám chặt nền tảng và lặp lại không ngừng. Tốc độ và tò mò vượt qua bằng cấp.',
    focus: [
      'Tạo minh chứng năng lực cho thấy chiều sâu kỹ thuật.',
      'Tìm đội ngũ ra sản phẩm tham vọng nhanh chóng.',
      'Học nguyên lý gốc để đơn giản hóa phức tạp.'
    ],
    voice: [
      'Khẩn trương và thẳng thắn.',
      'Đề cao thử nghiệm và lặp lại nhanh.',
      'Khuyến khích mục tiêu táo bạo.'
    ],
    accent: '#E9FAF7',
    quote: '"Lập luận từ nguyên lý gốc, rồi đi thật nhanh."',
    badge: 'Hacker nguyên lý gốc',
    image: '/image/elon-musk.jpg'
  }
]

const advisorReplies = {
  'steve jobs': 'Giữ câu chuyện nhất quán. Chắt lọc về khoảnh khắc bạn đổi hướng sản phẩm.',
  'warren buffett': 'Nhắm vào tăng trưởng bền vững—thể hiện sự đều đặn trong số liệu, không chỉ đỉnh cao.',
  'elon musk': 'Bắt đầu từ nguyên lý gốc. Bằng chứng tác động đơn giản nhất bạn có thể đưa ra là gì?'
}

const getAdvisorReply = (advisorName, prompt) => {
  const lower = advisorName.toLowerCase()
  const base = advisorReplies[lower] || 'Hãy nói mục tiêu bạn muốn đạt, rồi chúng ta sẽ đảo ngược câu chuyện.'
  return `${base} Bây giờ, hãy làm rõ câu hỏi: ${prompt}`
}

// ===== CV FIXER DATA & FUNCTIONS =====
const defaultCv = `Alex Morgan
Nhà thiết kế sản phẩm | alexmorgan.design | Austin, TX

Kinh nghiệm
- Trưởng nhóm thiết kế sản phẩm tại NextWave (2020–Nay)
• Dẫn dắt thiết kế lại onboarding, tăng activation 26%
• Xây dựng design system với 42 thành phần tái sử dụng

- Nhà thiết kế UX tại Harbor Labs (2017–2020)
• Ra mắt 4 bản phát hành mobile lớn cùng đội đa chức năng

Kỹ năng
Figma, Design Systems, UX Research, Prototyping, HTML/CSS

Học vấn
Cử nhân Thiết kế thị giác, Đại học Texas`

const generateCvAdvice = (text) => {
  const advice = []
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words < 80) {
    advice.push('Thêm kết quả đo lường được để nhà tuyển dụng thấy tác động nhanh hơn.')
  } else {
    advice.push('Độ dài tốt—giờ hãy gọn mỗi gạch đầu dòng thành một thành tựu rõ ràng.')
  }
  if (!/metrics|%|\d+/.test(text)) {
    advice.push('Bổ sung số liệu (%, $, thời gian tiết kiệm) để định lượng kết quả.')
  }
  if (!/portfolio|case study|github|behance|dribbble|dự án|hồ sơ/i.test(text)) {
    advice.push('Thêm liên kết portfolio hoặc case study ở phần đầu.')
  }
  if (!/summary|profile|objective|tóm tắt|mục tiêu/i.test(text)) {
    advice.push('Thêm phần tóm tắt 2–3 dòng nhắm tới vai trò mong muốn.')
  }
  advice.push('Sắp xếp lại kỹ năng để khớp với từ khóa trong JD.')
  return advice
}

const getImpactScore = (text) => {
  let score = 40
  if (/\d+|%/.test(text)) score += 20
  if (/summary|profile|objective|tóm tắt|mục tiêu/i.test(text)) score += 15
  if (/portfolio|case study|github|behance|dribbble|dự án|hồ sơ/i.test(text)) score += 10
  if (text.split(/\s+/).length > 120) score += 10
  return Math.min(score, 100)
}

const detectSections = (text) => {
  const lines = text.split('\n')
  const sections = []
  let index = 0
  lines.forEach((line) => {
    const trimmed = line.trim()
    const match = ['experience', 'achievements', 'skills', 'summary', 'education', 'kinh nghiệm', 'thành tích', 'kỹ năng', 'tóm tắt', 'học vấn'].find(
      (section) => trimmed.toLowerCase() === section
    )
    if (match) {
      sections.push({ label: match.charAt(0).toUpperCase() + match.slice(1), index })
    }
    index += line.length + 1
  })
  return sections
}

const highlightCvLines = (text) => {
  const strongVerbs = ['led', 'built', 'shipped', 'designed', 'delivered', 'dẫn dắt', 'xây dựng', 'ra mắt']
  return text.split('\n').map((line, idx) => {
    const lower = line.toLowerCase()
    const hasMetric = /\d+|%/.test(line)
    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-')
    const isStrong = strongVerbs.some((verb) => lower.includes(verb))
    const tooLong = line.length > 90
    let className = ''
    if (isBullet && !hasMetric) className = 'highlight-missing'
    if (tooLong) className = 'highlight-weak'
    if (isStrong) className = 'highlight-strong'
    return { text: line || ' ', className, key: `${idx}-${line}` }
  })
}

// ===== PROFILE DATA =====
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

// ===== TABS =====
const TABS = [
  { id: 'advisor', label: 'Cố vấn sự nghiệp' },
  { id: 'cv', label: 'Chỉnh sửa CV' }
]

export default function AdvisorProfilePage() {
  const [activeTab, setActiveTab] = useState('advisor')

  // Advisor state
  const [selectedAdvisor, setSelectedAdvisor] = useState(0)
  const [advisorQuestion, setAdvisorQuestion] = useState('')
  const [advisorResponse, setAdvisorResponse] = useState('')
  const [advisorPanelOpen, setAdvisorPanelOpen] = useState(false)

  // CV state
  const [cvText, setCvText] = useState(defaultCv)

  const advisor = advisors[selectedAdvisor]

  // CV computed values
  const adviceList = useMemo(() => generateCvAdvice(cvText), [cvText])
  const impactScore = useMemo(() => getImpactScore(cvText), [cvText])
  const sections = useMemo(() => detectSections(cvText), [cvText])
  const highlightedLines = useMemo(() => highlightCvLines(cvText), [cvText])

  const handleAdvisorAsk = () => {
    if (!advisorQuestion.trim()) return
    setAdvisorPanelOpen(true)
    setAdvisorResponse(getAdvisorReply(advisor.name, advisorQuestion.trim()))
    setAdvisorQuestion('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdvisorAsk()
  }

  const handleSectionJump = (index) => {
    const textarea = document.getElementById('cv-textarea')
    if (!textarea) return
    textarea.focus()
    textarea.setSelectionRange(index, index)
    const lineNumber = textarea.value.slice(0, index).split('\n').length
    const lineHeight = 20
    textarea.scrollTop = Math.max(0, (lineNumber - 3) * lineHeight)
  }

  return (
    <div className="advisor-profile-page">
      <div className="advisor-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`advisor-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'advisor' && (
        <div className="advisor-view">
          {/* Cố vấn huyền thoại Section */}
          <div className="advisor-header">
            <h2 className="advisor-page-title">Phòng tư vấn sự nghiệp</h2>
            <p className="advisor-page-subtitle">Cố vấn theo phong cách LLM, lấy cảm hứng từ các lãnh đạo huyền thoại</p>
          </div>

          <div className="advisor-row">
            {advisors.map((item, index) => (
              <div
                key={item.name}
                className={`advisor-card ${index === selectedAdvisor ? 'active' : ''}`}
                style={{ backgroundColor: item.accent }}
                onClick={() => setSelectedAdvisor(index)}
              >
                <div className="advisor-avatar">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="advisor-name">{item.name}</div>
                <div className="advisor-title">{item.title}</div>
                <div className="advisor-style">{item.style}</div>
                <div className="advisor-badge">{item.badge}</div>
                {index === selectedAdvisor && <div className="advisor-quote">{item.quote}</div>}
              </div>
            ))}
          </div>

          <div className="advisor-detail">
            <div className="advisor-headline">{advisor.headline}</div>
            <p className="advisor-summary">{advisor.summary}</p>

            <div className="detail-columns">
              <div className="detail-card">
                <div className="detail-title">Trọng tâm hành động</div>
                {advisor.focus.map((item) => (
                  <div key={item} className="detail-bullet">• {item}</div>
                ))}
              </div>
              <div className="detail-card">
                <div className="detail-title">Giọng điệu đặc trưng</div>
                {advisor.voice.map((item) => (
                  <div key={item} className="detail-bullet">• {item}</div>
                ))}
              </div>
            </div>

            <div className={`advisor-panel ${advisorPanelOpen ? 'open' : ''}`}>
              <div className="advisor-panel-header">
                <span>Hỏi {advisor.name.split(' ')[0]}</span>
                <button className="panel-toggle" onClick={() => setAdvisorPanelOpen((prev) => !prev)}>
                  {advisorPanelOpen ? 'Ẩn' : 'Hỏi'}
                </button>
              </div>
              <div className="advisor-panel-body">
                <input
                  type="text"
                  className="advisor-input"
                  placeholder={`${advisor.name.split(' ')[0]}, làm sao để kể chuyện tốt hơn trong CV?`}
                  value={advisorQuestion}
                  onChange={(e) => setAdvisorQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="primary-button" onClick={handleAdvisorAsk}>
                  Gửi câu hỏi
                </button>
                {advisorResponse && <p className="advisor-response">{advisorResponse}</p>}
              </div>
            </div>

            <p className="disclaimer">Lời khuyên được tạo để tham khảo, không đại diện cho xác nhận thực tế.</p>
          </div>

          {/* Hồ sơ Mentor Section */}
          <div className="advisor-profile-view" style={{ marginTop: '24px' }}>
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
        </div>
      )}

      {activeTab === 'cv' && (
        <div className="cv-view">
          <div className="cv-header">
            <h2 className="cv-page-title">Chỉnh sửa CV & hồ sơ</h2>
            <p className="cv-page-subtitle">Xem trước CV, nhận góp ý tức thì và nâng cao tác động</p>
          </div>

          <div className="cv-layout">
            <aside className="cv-sidebar">
              <div className="sidebar-title">Mục</div>
              {sections.map((section) => (
                <button key={section.label} className="sidebar-link" onClick={() => handleSectionJump(section.index)}>
                  {section.label}
                </button>
              ))}
              <div className="impact-card">
                <div className="impact-title">Điểm tác động</div>
                <div className="impact-score">{impactScore}%</div>
                <div className="impact-bar">
                  <div className="impact-fill" style={{ width: `${impactScore}%` }} />
                </div>
                <p className="impact-sub">Nên bổ sung thêm số liệu + động từ mạnh.</p>
              </div>
            </aside>

            <div className="cv-main">
              <div className="cv-card-row">
                <div className="cv-card">
                  <div className="cv-card-title">CV của bạn</div>
                  <textarea
                    id="cv-textarea"
                    className="cv-input"
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                  />
                  <div className="cv-badge">
                    <span className="cv-badge-text">✨ Gợi ý từ LLM</span>
                  </div>
                </div>

                <div className="cv-card">
                  <div className="cv-card-title">Đánh dấu trực tiếp</div>
                  <div className="cv-preview">
                    {highlightedLines.map((line) => (
                      <div key={line.key} className={`cv-line ${line.className}`}>
                        {line.text}
                      </div>
                    ))}
                  </div>
                  <div className="highlight-legend">
                    <span className="legend-item"><span className="legend-dot strong"></span> Động từ mạnh</span>
                    <span className="legend-item"><span className="legend-dot missing"></span> Thiếu số liệu</span>
                    <span className="legend-item"><span className="legend-dot weak"></span> Quá dài</span>
                  </div>
                </div>
              </div>

              <div className="cv-card-row">
                <div className="cv-card">
                  <div className="cv-card-title">Gợi ý cải thiện</div>
                  {adviceList.map((item) => (
                    <div key={item} className="advice-bullet">• {item}</div>
                  ))}
                </div>

                <div className="cv-card">
                  <div className="cv-card-title">Viết lại song song</div>
                  <div className="rewrite-row">
                    <div className="rewrite-col">
                      <div className="rewrite-label">Bản gốc</div>
                      <div className="rewrite-text">• Ra mắt 4 bản phát hành mobile lớn cùng đội đa chức năng</div>
                    </div>
                    <div className="rewrite-col">
                      <div className="rewrite-label">Bản cải thiện</div>
                      <div className="rewrite-text improved">• Triển khai 4 bản phát hành mobile với đội 6 người, giảm thời gian QA 18%</div>
                    </div>
                  </div>
                  <div className="rewrite-row">
                    <div className="rewrite-col">
                      <div className="rewrite-label">Bản gốc</div>
                      <div className="rewrite-text">• Dẫn dắt thiết kế lại onboarding, tăng activation 26%</div>
                    </div>
                    <div className="rewrite-col">
                      <div className="rewrite-label">Bản cải thiện</div>
                      <div className="rewrite-text improved">• Làm lại luồng onboarding và nâng activation +26% trong 90 ngày</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
