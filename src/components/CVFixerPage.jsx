import { useState, useMemo } from 'react'

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

export default function CVFixerPage() {
  const [cvText, setCvText] = useState(defaultCv)

  const adviceList = useMemo(() => generateCvAdvice(cvText), [cvText])
  const impactScore = useMemo(() => getImpactScore(cvText), [cvText])
  const sections = useMemo(() => detectSections(cvText), [cvText])
  const highlightedLines = useMemo(() => highlightCvLines(cvText), [cvText])

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
  )
}
