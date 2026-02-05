import { useState, useMemo, useRef, useEffect } from 'react'

const chatPrompts = [
  'Hãy nhờ tôi viết lại một gạch đầu dòng.',
  'Chia sẻ vai trò bạn đang nhắm tới.',
  'Bạn cần tóm tắt gọn hơn?'
]

const resumePersonas = [
  { label: 'Chuyên nghiệp', value: 'professional' },
  { label: 'Táo bạo & tự tin', value: 'bold' },
  { label: 'Tối giản', value: 'minimalist' },
  { label: 'Kể chuyện', value: 'narrative' }
]

const generateChatResponse = (prompt, persona) => {
  const lower = prompt.toLowerCase()
  if (lower.includes('rewrite') || lower.includes('bullet') || lower.includes('viết lại') || lower.includes('gạch')) {
    return 'Thử: "Dẫn dắt thiết kế lại đa chức năng giúp tăng activation 26% và giảm thời gian onboarding 18%."'
  }
  if (lower.includes('summary') || lower.includes('profile') || lower.includes('tóm tắt') || lower.includes('hồ sơ')) {
    return 'Gợi ý tóm tắt: "Nhà thiết kế sản phẩm tập trung tăng trưởng và onboarding, tạo cải thiện đo lường ở activation và retention."'
  }
  if (lower.includes('skills') || lower.includes('kỹ năng')) {
    return 'Nhóm kỹ năng theo danh mục: "Thiết kế sản phẩm, Nghiên cứu, Hệ thống" để dễ quét hơn.'
  }
  if (persona === 'bold') {
    return 'Khẳng định tác động: "Tôi nâng activation 26% bằng cách tái thiết kế luồng onboarding."'
  }
  if (persona === 'minimalist') {
    return 'Giữ thật gọn: "Thiết kế lại onboarding, +26% activation."'
  }
  if (persona === 'narrative') {
    return 'Kể câu chuyện: "Tôi thấy rơi rụng ở onboarding, rồi làm lại luồng để nâng activation 26%."'
  }
  return 'Cho tôi biết vai trò bạn muốn, tôi sẽ chỉnh headline và gạch đầu dòng.'
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
      text: 'Chia sẻ vai trò bạn đang nhắm tới, tôi sẽ giúp viết lại các gạch đầu dòng ấn tượng hơn.'
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
    if (lower.includes('summary') || lower.includes('tóm tắt')) return ['Tăng sức mạnh tóm tắt', 'Headline chuyên nghiệp', 'Móc kể chuyện']
    if (lower.includes('skills') || lower.includes('kỹ năng')) return ['Phiên bản tối ưu ATS', 'Cải thiện kỹ năng', 'Rút gọn danh sách']
    if (lower.includes('bullet') || lower.includes('gạch')) return ['Viết lại gạch đầu dòng', 'Thêm số liệu', 'Dùng động từ mạnh']
    return ['Viết lại gạch đầu dòng', 'Tăng sức mạnh tóm tắt', 'Phiên bản tối ưu ATS', 'Cải thiện kỹ năng']
  }, [chatInput])

  const currentPrompt = chatPrompts[Math.floor(Date.now() / 5000) % chatPrompts.length]

  return (
    <div className="chat-view">
      <div className="chat-header-section">
        <h2 className="chat-page-title">Trợ lý trò chuyện</h2>
        <p className="chat-page-subtitle">Trao đổi với chuyên gia CV để cải thiện nhanh</p>
      </div>

      <div className="chat-container">
        <div className="chat-card">
          <div className="chat-card-header">
            <div>
              <div className="chat-card-title">Trò chuyện chỉnh sửa</div>
              <div className="chat-sub">{currentPrompt}</div>
            </div>
            <div className="persona-select">
              <span className="persona-label">Phong cách</span>
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
                <span className="chat-text">Đang suy nghĩ</span>
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
              placeholder="Hãy hỏi để viết lại hoặc bổ sung mục mới..."
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
