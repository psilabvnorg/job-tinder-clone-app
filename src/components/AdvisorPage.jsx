import { useState } from 'react'

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
    </div>
  )
}
