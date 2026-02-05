import { useState, useMemo, useRef, useEffect } from 'react'

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

// Icons
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
)

export default function ChatPage() {
  const [chatInput, setChatInput] = useState('')
  const [chatLog, setChatLog] = useState([
    {
      role: 'ai',
      text: "Share what role you're targeting and I'll help rewrite bullet points with stronger impact."
    }
  ])
  const [chatPersona, setChatPersona] = useState('professional')
  const [isThinking, setIsThinking] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatLog, isThinking])

  const handleSend = () => {
    if (!chatInput.trim()) return
    const prompt = chatInput.trim()
    setChatLog((prev) => [...prev, { role: 'user', text: prompt }])
    setChatInput('')
    setIsThinking(true)
    setTimeout(() => {
      setChatLog((prev) => [...prev, { role: 'ai', text: generateChatResponse(prompt, chatPersona) }])
      setIsThinking(false)
    }, 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const chatSuggestions = useMemo(() => {
    const lower = chatInput.toLowerCase()
    if (lower.includes('summary')) return ['Strengthen summary', 'Professional headline', 'Narrative hook']
    if (lower.includes('skills')) return ['ATS-friendly version', 'Improve skills', 'Trim list']
    if (lower.includes('bullet')) return ['Rewrite bullet', 'Add metrics', 'Use stronger verbs']
    return ['Rewrite bullet', 'Strengthen summary', 'ATS-friendly version', 'Improve skills']
  }, [chatInput])

  const currentPrompt = chatPrompts[Math.floor(Date.now() / 5000) % chatPrompts.length]

  return (
    <div className="chat-view">
      <div className="chat-header-section">
        <h2 className="chat-page-title">Chat Assistant</h2>
        <p className="chat-page-subtitle">Talk to a resume strategist and get fast improvements</p>
      </div>

      <div className="chat-container">
        <div className="chat-card">
          <div className="chat-card-header">
            <div>
              <div className="chat-card-title">Fix-it Chat</div>
              <div className="chat-sub">{currentPrompt}</div>
            </div>
            <div className="persona-select">
              <span className="persona-label">Persona</span>
              <select value={chatPersona} onChange={(e) => setChatPersona(e.target.value)}>
                {resumePersonas.map((persona) => (
                  <option key={persona.value} value={persona.value}>
                    {persona.label}
                  </option>
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
                <span className="chat-text">Thinking</span>
                <span className="dot-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
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
            <button className="send-button" onClick={handleSend} disabled={!chatInput.trim()}>
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
