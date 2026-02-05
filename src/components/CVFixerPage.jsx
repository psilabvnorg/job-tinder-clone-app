import { useState, useMemo } from 'react'

const defaultCv = `Alex Morgan
Product Designer | alexmorgan.design | Austin, TX

Experience
- Lead product designer at NextWave (2020–Present)
• Led redesign of onboarding, improved activation by 26%
• Built a design system with 42 reusable components

- UX designer at Harbor Labs (2017–2020)
• Shipped 4 major mobile releases with cross-functional team

Skills
Figma, Design Systems, UX Research, Prototyping, HTML/CSS

Education
BA in Visual Design, University of Texas`

const generateCvAdvice = (text) => {
  const advice = []
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words < 80) {
    advice.push('Add more measurable outcomes so recruiters see your impact quickly.')
  } else {
    advice.push('Strong length—now tighten each bullet to one crisp achievement.')
  }
  if (!/metrics|%|\d+/.test(text)) {
    advice.push('Include metrics (%, $ or time saved) to quantify results.')
  }
  if (!/portfolio|case study|github|behance|dribbble/i.test(text)) {
    advice.push('Add a portfolio or case study link near your header.')
  }
  if (!/summary|profile|objective/i.test(text)) {
    advice.push('Add a 2-3 line summary targeting your ideal role.')
  }
  advice.push('Reorder skills to match the top job description keywords.')
  return advice
}

const getImpactScore = (text) => {
  let score = 40
  if (/\d+|%/.test(text)) score += 20
  if (/summary|profile|objective/i.test(text)) score += 15
  if (/portfolio|case study|github|behance|dribbble/i.test(text)) score += 10
  if (text.split(/\s+/).length > 120) score += 10
  return Math.min(score, 100)
}

const detectSections = (text) => {
  const lines = text.split('\n')
  const sections = []
  let index = 0
  lines.forEach((line) => {
    const trimmed = line.trim()
    const match = ['experience', 'achievements', 'skills', 'summary', 'education'].find(
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
  const strongVerbs = ['led', 'built', 'shipped', 'designed', 'delivered']
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
        <h2 className="cv-page-title">Profile & CV Fixer</h2>
        <p className="cv-page-subtitle">Preview your CV, get instant critique, and improve your impact</p>
      </div>

      <div className="cv-layout">
        <aside className="cv-sidebar">
          <div className="sidebar-title">Sections</div>
          {sections.map((section) => (
            <button key={section.label} className="sidebar-link" onClick={() => handleSectionJump(section.index)}>
              {section.label}
            </button>
          ))}
          <div className="impact-card">
            <div className="impact-title">Impact Score</div>
            <div className="impact-score">{impactScore}%</div>
            <div className="impact-bar">
              <div className="impact-fill" style={{ width: `${impactScore}%` }} />
            </div>
            <p className="impact-sub">Could use more metrics + stronger verbs.</p>
          </div>
        </aside>

        <div className="cv-main">
          <div className="cv-card-row">
            <div className="cv-card">
              <div className="cv-card-title">Your CV</div>
              <textarea
                id="cv-textarea"
                className="cv-input"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
              <div className="cv-badge">
                <span className="cv-badge-text">✨ LLM-generated critique</span>
              </div>
            </div>

            <div className="cv-card">
              <div className="cv-card-title">Live Highlights</div>
              <div className="cv-preview">
                {highlightedLines.map((line) => (
                  <div key={line.key} className={`cv-line ${line.className}`}>
                    {line.text}
                  </div>
                ))}
              </div>
              <div className="highlight-legend">
                <span className="legend-item"><span className="legend-dot strong"></span> Strong verb</span>
                <span className="legend-item"><span className="legend-dot missing"></span> Needs metrics</span>
                <span className="legend-item"><span className="legend-dot weak"></span> Too long</span>
              </div>
            </div>
          </div>

          <div className="cv-card-row">
            <div className="cv-card">
              <div className="cv-card-title">CV Advice</div>
              {adviceList.map((item) => (
                <div key={item} className="advice-bullet">• {item}</div>
              ))}
            </div>

            <div className="cv-card">
              <div className="cv-card-title">Side-by-Side Rewrite</div>
              <div className="rewrite-row">
                <div className="rewrite-col">
                  <div className="rewrite-label">Original</div>
                  <div className="rewrite-text">• Shipped 4 major mobile releases with cross-functional team</div>
                </div>
                <div className="rewrite-col">
                  <div className="rewrite-label">Improved</div>
                  <div className="rewrite-text improved">• Delivered 4 mobile releases with a 6-person squad, cutting QA time by 18%</div>
                </div>
              </div>
              <div className="rewrite-row">
                <div className="rewrite-col">
                  <div className="rewrite-label">Original</div>
                  <div className="rewrite-text">• Led redesign of onboarding, improved activation by 26%</div>
                </div>
                <div className="rewrite-col">
                  <div className="rewrite-label">Improved</div>
                  <div className="rewrite-text improved">• Rebuilt onboarding flow and lifted activation +26% within 90 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
