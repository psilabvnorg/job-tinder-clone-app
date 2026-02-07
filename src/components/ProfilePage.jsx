import { useMemo, useState } from 'react'

const defaultCv = `Alex Morgan
Nhà thiết kế sản phẩm | alexmorgan.design | Austin, TX

Tóm tắt
Nhà thiết kế sản phẩm tập trung vào onboarding và tăng trưởng, tạo ra kết quả đo lường được.

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
  if (words < 90) {
    advice.push('Thêm 1-2 thành tựu định lượng để CV giàu tác động hơn.')
  } else {
    advice.push('Độ dài phù hợp—giờ hãy rút gọn mỗi bullet thành một kết quả chính.')
  }
  if (!/metrics|%|\d+/.test(text)) {
    advice.push('Bổ sung số liệu (%, $, thời gian tiết kiệm) để định lượng kết quả.')
  }
  if (!/portfolio|case study|github|behance|dribbble|dự án|hồ sơ/i.test(text)) {
    advice.push('Thêm liên kết portfolio hoặc case study ở phần đầu.')
  }
  advice.push('Ưu tiên từ khóa từ JD để tăng điểm ATS.')
  return advice
}

const getImpactScore = (text) => {
  let score = 45
  if (/\d+|%/.test(text)) score += 20
  if (/summary|profile|objective|tóm tắt|mục tiêu/i.test(text)) score += 15
  if (/portfolio|case study|github|behance|dribbble|dự án|hồ sơ/i.test(text)) score += 10
  if (text.split(/\s+/).length > 120) score += 10
  return Math.min(score, 100)
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

const llmActions = [
  { id: 1, title: 'Viết lại summary', description: 'Tập trung vào kết quả và vai trò mục tiêu.' },
  { id: 2, title: 'Tối ưu ATS', description: 'Đối chiếu với JD và nhấn từ khóa.' },
  { id: 3, title: 'Gợi ý thành tựu', description: 'Biến bullet thành số liệu đo lường.' }
]

export default function ProfilePage() {
  const [cvText, setCvText] = useState(defaultCv)
  const adviceList = useMemo(() => generateCvAdvice(cvText), [cvText])
  const impactScore = useMemo(() => getImpactScore(cvText), [cvText])
  const highlightedLines = useMemo(() => highlightCvLines(cvText), [cvText])

  return (
    <div className="profile-page">
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-avatar-large">AM</div>
          <div>
            <h2>Alex Morgan</h2>
            <p>Product Designer • 5 năm kinh nghiệm</p>
            <div className="profile-tags">
              <span>Onboarding</span>
              <span>Design Systems</span>
              <span>UX Research</span>
            </div>
          </div>
          <button className="profile-primary-btn">Cập nhật CV</button>
        </div>
        <div className="profile-hero-metrics">
          <div>
            <div className="metric-value">{impactScore}%</div>
            <div className="metric-label">CV Impact</div>
          </div>
          <div>
            <div className="metric-value">3</div>
            <div className="metric-label">Ứng tuyển tuần này</div>
          </div>
          <div>
            <div className="metric-value">12</div>
            <div className="metric-label">Matched jobs</div>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>LLM Coach</h3>
          <p className="profile-card-subtitle">Chọn nhanh tác vụ để AI hỗ trợ chỉnh CV.</p>
          <div className="llm-action-list">
            {llmActions.map((action) => (
              <div key={action.id} className="llm-action-card">
                <div>
                  <div className="llm-action-title">{action.title}</div>
                  <p className="llm-action-desc">{action.description}</p>
                </div>
                <button className="llm-action-btn">Chạy</button>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <h3>Gợi ý nhanh</h3>
          <div className="profile-advice">
            {adviceList.map((item) => (
              <div key={item} className="advice-bullet">• {item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>CV Editor</h3>
          <textarea
            className="cv-input"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
          />
          <div className="cv-badge">
            <span className="cv-badge-text">✨ AI gợi ý trong thời gian thực</span>
          </div>
        </div>

        <div className="profile-card">
          <h3>Preview & highlight</h3>
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
    </div>
  )
}
