import { useMemo, useState, useEffect, useRef } from 'react'
import JobSwipe from './components/JobSwipe'

const advisors = [
  {
    name: 'Steve Jobs',
    title: 'Product Visionary',
    style: 'Focus on clarity, simplicity, and storytelling.',
    headline: 'Design your career like a product launch.',
    summary:
      'Obsess over the experience you create for users. Remove everything that is not essential. Build a career narrative that people can feel.',
    focus: [
      'Craft a portfolio that tells one clear story.',
      'Prioritize roles that allow deep craftsmanship.',
      'Say no to distractions so you can ship legendary work.'
    ],
    voice: [
      'Challenging but inspiring.',
      'Encourages bold bets and taste-driven decisions.',
      'Pushes for simplicity, not compromise.'
    ],
    accent: '#FFE9E6',
    quote: '“Stay hungry. Stay foolish.”',
    badge: 'Simplicity Wizard'
  },
  {
    name: 'Warren Buffett',
    title: 'Long-Term Strategist',
    style: 'Build compounding value through patience and trust.',
    headline: 'Invest in yourself before any role.',
    summary:
      'Choose companies with durable cultures and leaders who respect craft. Focus on steady growth, not short-term hype.',
    focus: [
      'Deepen your fundamentals and communication skills.',
      'Select mentors with integrity and long-term vision.',
      'Make career moves that compound relationships.'
    ],
    voice: [
      'Calm, measured, and practical.',
      'Values consistency over flash.',
      'Encourages reputation-building.'
    ],
    accent: '#FFF8DA',
    quote: '“The best investment you can make is in yourself.”',
    badge: 'Long-Game Mastermind'
  },
  {
    name: 'Elon Musk',
    title: 'First-Principles Builder',
    style: 'Ambitious, technical, and mission-obsessed.',
    headline: 'Pick the hardest problems and move faster.',
    summary:
      'If the mission energizes you, obsess over the fundamentals and iterate relentlessly. Speed and curiosity beat credentials.',
    focus: [
      'Build proof-of-work that shows technical depth.',
      'Seek teams shipping ambitious products quickly.',
      'Learn first principles so you can simplify complexity.'
    ],
    voice: [
      'Urgent and direct.',
      'Values experimentation and rapid iteration.',
      'Encourages audacious goals.'
    ],
    accent: '#E9FAF7',
    quote: '“Reason from first principles, then move fast.”',
    badge: 'First-Principles Hacker'
  }
]

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

const chatPrompts = [
  'Ask me to rewrite a bullet.',
  'Share the role you are targeting.',
  'Need a tighter summary?'
]

const resumePersonas = [
  { label: 'Professional', value: 'professional' },
  { label: 'Bold & Confident', value: 'bold' },
  { label: 'Minimalist', value: 'minimalist' },
  { label: 'Narrative/Story-driven', value: 'narrative' }
]

const advisorReplies = {
  'steve jobs': 'Keep the story singular. Strip it down to the moment you changed the trajectory of a product.',
  'warren buffett': 'Aim for steady compounding—show consistency in your metrics, not just peaks.',
  'elon musk': 'Start from first principles. What is the simplest proof of impact you can show?'
}

const getAdvisorReply = (advisorName, prompt) => {
  const lower = advisorName.toLowerCase()
  const base = advisorReplies[lower] || 'Tell me what outcome you want to drive, and we will reverse engineer the story.'
  return `${base} Now, refine your question: ${prompt}`
}

const generateChatResponse = (prompt, persona) => {
  const lower = prompt.toLowerCase()
  if (lower.includes('rewrite') || lower.includes('bullet')) {
    return 'Try: "Led a cross-functional redesign that lifted activation by 26% and reduced onboarding time by 18%."'
  }
  if (lower.includes('summary') || lower.includes('profile')) {
    return 'Summary idea: "Product designer focused on growth and onboarding flows, delivering measurable lifts in activation and retention."'
  }
  if (lower.includes('skills')) {
    return 'Group skills by category: "Product Design, Research, Systems" to improve scanability.'
  }
  if (persona === 'bold') {
    return 'Own your impact: "I drove a 26% activation lift by reimagining the onboarding flow."'
  }
  if (persona === 'minimalist') {
    return 'Keep it tight: "Redesigned onboarding, +26% activation."'
  }
  if (persona === 'narrative') {
    return 'Tell the story: "I noticed drop-offs in onboarding, then rebuilt the flow to lift activation by 26%."'
  }
  return 'Tell me the role you want and I will tailor your headline and bullet points.'
}

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

export default function App() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(0)
  const [cvText, setCvText] = useState(defaultCv)
  const [chatInput, setChatInput] = useState('')
  const [chatLog, setChatLog] = useState([
    {
      role: 'ai',
      text: "Share what role you're targeting and I'll help rewrite bullet points with stronger impact."
    }
  ])
  const [chatPersona, setChatPersona] = useState('professional')
  const [isThinking, setIsThinking] = useState(false)
  const [advisorQuestion, setAdvisorQuestion] = useState('')
  const [advisorResponse, setAdvisorResponse] = useState('')
  const [advisorPanelOpen, setAdvisorPanelOpen] = useState(false)
  const [swipeStats, setSwipeStats] = useState({ saved: 0, passed: 0 })

  const adviceList = useMemo(() => generateCvAdvice(cvText), [cvText])
  const advisor = advisors[selectedAdvisor]
  const impactScore = useMemo(() => getImpactScore(cvText), [cvText])
  const sections = useMemo(() => detectSections(cvText), [cvText])
  const highlightedLines = useMemo(() => highlightCvLines(cvText), [cvText])

  const sectionRefs = {
    swipe: useRef(null),
    advisors: useRef(null),
    cv: useRef(null),
    chat: useRef(null)
  }

  const progressSteps = [
    { label: 'Jobs Swiped', done: swipeStats.saved + swipeStats.passed > 0 },
    { label: 'Advisor Reviewed', done: advisorPanelOpen || selectedAdvisor !== 0 },
    { label: 'CV Improved', done: cvText.trim() !== defaultCv.trim() }
  ]
  const progressPercent = Math.round((progressSteps.filter((step) => step.done).length / progressSteps.length) * 100)

  useEffect(() => {
    const onScroll = () => {
      const entries = [
        { key: 'swipe', color: '#FFE9E6', ref: sectionRefs.swipe },
        { key: 'advisors', color: '#FFF8DA', ref: sectionRefs.advisors },
        { key: 'cv', color: '#E9FAF7', ref: sectionRefs.cv },
        { key: 'chat', color: '#E6F0FF', ref: sectionRefs.chat }
      ]
      const scrollPosition = window.scrollY + window.innerHeight / 3
      let active = entries[0]
      entries.forEach((entry) => {
        if (entry.ref.current && entry.ref.current.offsetTop <= scrollPosition) {
          active = entry
        }
      })
      document.documentElement.style.setProperty('--section-accent', active.color)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSend = () => {
    if (!chatInput.trim()) return
    const prompt = chatInput.trim()
    setChatLog((prev) => [...prev, { role: 'user', text: prompt }])
    setChatInput('')
    setIsThinking(true)
    setTimeout(() => {
      setChatLog((prev) => [...prev, { role: 'ai', text: generateChatResponse(prompt, chatPersona) }])
      setIsThinking(false)
    }, 500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  const handleAdvisorAsk = () => {
    if (!advisorQuestion.trim()) return
    setAdvisorPanelOpen(true)
    setAdvisorResponse(getAdvisorReply(advisor.name, advisorQuestion.trim()))
    setAdvisorQuestion('')
  }

  const handleSectionJump = (index) => {
    const textarea = document.getElementById('cv-textarea')
    if (!textarea) return
    textarea.focus()
    textarea.setSelectionRange(index, index)
    const lineNumber = textarea.value.slice(0, index).split('\\n').length
    const lineHeight = 20
    textarea.scrollTop = Math.max(0, (lineNumber - 3) * lineHeight)
  }

  const chatSuggestions = useMemo(() => {
    const lower = chatInput.toLowerCase()
    if (lower.includes('summary')) return ['Strengthen summary', 'Professional headline', 'Narrative hook']
    if (lower.includes('skills')) return ['ATS-friendly version', 'Improve skills', 'Trim list']
    if (lower.includes('bullet')) return ['Rewrite bullet', 'Add metrics', 'Use stronger verbs']
    return ['Rewrite bullet', 'Strengthen summary', 'ATS-friendly version', 'Improve skills']
  }, [chatInput])

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="logo">JobSwipe</h1>
          <p className="subtitle">Career guidance + CV upgrades</p>
        </div>
        <div className="progress-tracker">
          <div className="progress-header">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-steps">
            {progressSteps.map((step) => (
              <span key={step.label} className={`progress-step ${step.done ? 'done' : ''}`}>
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky-nav">
        <a href="#job-swipe">Job Swipe</a>
        <a href="#advisors">Advisors</a>
        <a href="#cv-fixer">CV Fixer</a>
        <a href="#chat-assistant">Chat</a>
      </nav>

      <section id="job-swipe" className="section" ref={sectionRefs.swipe}>
        <h2 className="section-title">Job Swipe</h2>
        <p className="section-subtitle">
          Swipe right to save jobs you like, swipe left to pass. Find your next opportunity!
        </p>
        <JobSwipe onStatsChange={setSwipeStats} />
      </section>

      <section id="advisors" className="section" ref={sectionRefs.advisors}>
        <h2 className="section-title">Career Advice Lounge</h2>
        <p className="section-subtitle">
          LLM-styled mentorship inspired by Steve Jobs, Warren Buffett, and Elon Musk.
        </p>
        <div className="advisor-row">
          {advisors.map((item, index) => (
            <div
              key={item.name}
              className={`advisor-card ${index === selectedAdvisor ? 'active' : ''}`}
              style={{ backgroundColor: item.accent }}
              onClick={() => setSelectedAdvisor(index)}
            >
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
              <div className="detail-title">Actionable Focus</div>
              {advisor.focus.map((item) => (
                <div key={item} className="detail-bullet">• {item}</div>
              ))}
            </div>
            <div className="detail-card">
              <div className="detail-title">Signature Tone</div>
              {advisor.voice.map((item) => (
                <div key={item} className="detail-bullet">• {item}</div>
              ))}
            </div>
          </div>
          <div className={`advisor-panel ${advisorPanelOpen ? 'open' : ''}`}>
            <div className="advisor-panel-header">
              <span>Ask {advisor.name.split(' ')[0]}</span>
              <button className="panel-toggle" onClick={() => setAdvisorPanelOpen((prev) => !prev)}>
                {advisorPanelOpen ? 'Hide' : 'Ask'}
              </button>
            </div>
            <div className="advisor-panel-body">
              <input
                type="text"
                className="advisor-input"
                placeholder="Steve, how can I improve storytelling in my CV?"
                value={advisorQuestion}
                onChange={(e) => setAdvisorQuestion(e.target.value)}
              />
              <button className="primary-button" onClick={handleAdvisorAsk}>
                <span className="primary-button-text">Send question</span>
              </button>
              {advisorResponse && <p className="advisor-response">{advisorResponse}</p>}
            </div>
          </div>
          <p className="disclaimer">
            Advice is generated for inspiration and does not represent real-world endorsements.
          </p>
        </div>
      </section>

      <section id="cv-fixer" className="section" ref={sectionRefs.cv}>
        <h2 className="section-title">Profile & CV Fixer</h2>
        <p className="section-subtitle">
          Preview your CV, get instant critique, and chat with a fixer assistant.
        </p>
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
              <p className="impact-sub">Could use more metrics + stronger verbs.</p>
            </div>
          </aside>
          <div className="card-row">
            <div className="card">
              <div className="card-title">Your CV</div>
              <textarea
                id="cv-textarea"
                className="cv-input"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
              <div className="badge">
                <span className="badge-text">✨ LLM-generated critique</span>
              </div>
            </div>
            <div className="card">
              <div className="card-title">Live Highlights</div>
              <div className="cv-preview">
                {highlightedLines.map((line) => (
                  <div key={line.key} className={`cv-line ${line.className}`}>{line.text}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="card-row">
          <div className="card">
            <div className="card-title">CV Advice</div>
            {adviceList.map((item) => (
              <div key={item} className="detail-bullet">• {item}</div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">Side-by-Side Rewrite</div>
            <div className="rewrite-row">
              <div>
                <div className="rewrite-label">Original</div>
                <div className="rewrite-text">• Shipped 4 major mobile releases with cross-functional team</div>
              </div>
              <div>
                <div className="rewrite-label">Improved</div>
                <div className="rewrite-text improved">• Delivered 4 mobile releases with a 6-person squad, cutting QA time by 18%</div>
              </div>
            </div>
            <div className="rewrite-row">
              <div>
                <div className="rewrite-label">Original</div>
                <div className="rewrite-text">• Led redesign of onboarding, improved activation by 26%</div>
              </div>
              <div>
                <div className="rewrite-label">Improved</div>
                <div className="rewrite-text improved">• Rebuilt onboarding flow and lifted activation +26% within 90 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="chat-assistant" className="section" ref={sectionRefs.chat}>
        <h2 className="section-title">Chat Assistant</h2>
        <p className="section-subtitle">Talk to a resume strategist and get fast improvements.</p>
        <div className="chat-card">
          <div className="chat-header">
            <div>
              <div className="card-title">Fix-it Chat</div>
              <div className="chat-sub">
                {chatPrompts[Math.floor(Date.now() / 1000) % chatPrompts.length]}
              </div>
            </div>
            <div className="persona-select">
              <span className="persona-label">Persona</span>
              <select value={chatPersona} onChange={(e) => setChatPersona(e.target.value)}>
                {resumePersonas.map((persona) => (
                  <option key={persona.value} value={persona.value}>{persona.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="suggestion-row">
            {chatSuggestions.map((chip) => (
              <button key={chip} className="suggestion-chip" onClick={() => setChatInput(chip)}>
                {chip}
              </button>
            ))}
          </div>
          <div className="chat-log">
            {chatLog.map((entry, index) => (
              <div
                key={`${entry.role}-${index}`}
                className={`chat-bubble ${entry.role === 'user' ? 'chat-user' : 'chat-ai'}`}
              >
                <span className="chat-text">{entry.text}</span>
              </div>
            ))}
            {isThinking && (
              <div className="chat-bubble chat-ai">
                <span className="chat-text">Working</span>
                <span className="dot-loader">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a rewrite or new section..."
            />
            <button className="primary-button" onClick={handleSend}>
              <span className="primary-button-text">Send</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="footer-nav">
        <a href="#job-swipe">Swipe</a>
        <a href="#job-swipe">Matched</a>
        <a href="#advisors">Advisor</a>
        <a href="#cv-fixer">CV</a>
        <a href="#chat-assistant">Chat</a>
      </footer>
    </div>
  )
}
