import { useMemo, useState } from 'react'
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
    accent: '#FFE9E6'
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
    accent: '#FFF8DA'
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
    accent: '#E9FAF7'
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


const generateChatResponse = (prompt) => {
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

  const adviceList = useMemo(() => generateCvAdvice(cvText), [cvText])
  const advisor = advisors[selectedAdvisor]

  const handleSend = () => {
    if (!chatInput.trim()) return
    const prompt = chatInput.trim()
    setChatLog((prev) => [...prev, { role: 'user', text: prompt }])
    setChatInput('')
    setTimeout(() => {
      setChatLog((prev) => [...prev, { role: 'ai', text: generateChatResponse(prompt) }])
    }, 300)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="logo">JobSwipe</h1>
        <p className="subtitle">Career guidance + CV upgrades</p>
      </header>

      <section className="section">
        <h2 className="section-title">Job Swipe</h2>
        <p className="section-subtitle">
          Swipe right to save jobs you like, swipe left to pass. Find your next opportunity!
        </p>
        <JobSwipe />
      </section>

      <section className="section">
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
          <p className="disclaimer">
            Advice is generated for inspiration and does not represent real-world endorsements.
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Profile & CV Fixer</h2>
        <p className="section-subtitle">
          Preview your CV, get instant critique, and chat with a fixer assistant.
        </p>
        <div className="card-row">
          <div className="card">
            <div className="card-title">Your CV</div>
            <textarea
              className="cv-input"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
            />
            <div className="badge">
              <span className="badge-text">✨ LLM-generated critique</span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">CV Advice</div>
            {adviceList.map((item) => (
              <div key={item} className="detail-bullet">• {item}</div>
            ))}
          </div>
        </div>
        <div className="chat-card">
          <div className="chat-header">
            <div className="card-title">Fix-it Chat</div>
            <div className="chat-sub">
              {chatPrompts[Math.floor(Date.now() / 1000) % chatPrompts.length]}
            </div>
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
    </div>
  )
}
