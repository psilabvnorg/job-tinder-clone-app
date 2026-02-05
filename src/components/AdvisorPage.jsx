import { useState } from 'react'

const advisors = [
  {
    name: 'Steve Jobs',
    title: 'Product Visionary',
    style: 'Focus on clarity, simplicity, and storytelling.',
    headline: 'Design your career like a product launch.',
    summary: 'Obsess over the experience you create for users. Remove everything that is not essential. Build a career narrative that people can feel.',
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
    quote: '"Stay hungry. Stay foolish."',
    badge: 'Simplicity Wizard',
    image: '/image/steve-jobs.jpg'
  },
  {
    name: 'Warren Buffett',
    title: 'Long-Term Strategist',
    style: 'Build compounding value through patience and trust.',
    headline: 'Invest in yourself before any role.',
    summary: 'Choose companies with durable cultures and leaders who respect craft. Focus on steady growth, not short-term hype.',
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
    quote: '"The best investment you can make is in yourself."',
    badge: 'Long-Game Mastermind',
    image: '/image/warren-buffet.jpg'
  },
  {
    name: 'Elon Musk',
    title: 'First-Principles Builder',
    style: 'Ambitious, technical, and mission-obsessed.',
    headline: 'Pick the hardest problems and move faster.',
    summary: 'If the mission energizes you, obsess over the fundamentals and iterate relentlessly. Speed and curiosity beat credentials.',
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
    quote: '"Reason from first principles, then move fast."',
    badge: 'First-Principles Hacker',
    image: '/image/elon-musk.jpg'
  }
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

export default function AdvisorPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(0)
  const [advisorQuestion, setAdvisorQuestion] = useState('')
  const [advisorResponse, setAdvisorResponse] = useState('')
  const [advisorPanelOpen, setAdvisorPanelOpen] = useState(false)

  const advisor = advisors[selectedAdvisor]

  const handleAdvisorAsk = () => {
    if (!advisorQuestion.trim()) return
    setAdvisorPanelOpen(true)
    setAdvisorResponse(getAdvisorReply(advisor.name, advisorQuestion.trim()))
    setAdvisorQuestion('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdvisorAsk()
  }

  return (
    <div className="advisor-view">
      <div className="advisor-header">
        <h2 className="advisor-page-title">Career Advice Lounge</h2>
        <p className="advisor-page-subtitle">LLM-styled mentorship inspired by legendary leaders</p>
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
              placeholder={`${advisor.name.split(' ')[0]}, how can I improve storytelling in my CV?`}
              value={advisorQuestion}
              onChange={(e) => setAdvisorQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="primary-button" onClick={handleAdvisorAsk}>
              Send question
            </button>
            {advisorResponse && <p className="advisor-response">{advisorResponse}</p>}
          </div>
        </div>

        <p className="disclaimer">Advice is generated for inspiration and does not represent real-world endorsements.</p>
      </div>
    </div>
  )
}
