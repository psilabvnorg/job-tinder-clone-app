C:\Users\tung3436\WORK\000 TESTING\job-tinder-clone-app\script>python view-db.py

============================================================
TABLE: jobs
============================================================
Columns: id, title, company, location, salary, job_type, category, remote, description, requirements, url, source, background_image, created_at, raw_data, crawled_at       

--- Row 1 ---
  id: 1b0c9e0adfe3
  title: NULL
  company: NULL
  location: NULL
  salary: Thoa thuan
  job_type: NULL
  category: Khác
  remote: NULL
  description: NULL
  requirements: NULL
  url: https://www.topcv.vn/brand/concentrixservices/tuyen-dung/thuc-tap-sinh-kinh-doan...
  source: topcv
  background_image: https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80
  created_at: 2026-02-05T14:44:10.048361
  raw_data: {"id": "1b0c9e0adfe3", "title": "", "company": "", "salary": "Thoa thuan", "loca...
  crawled_at: 2026-02-05T15:19:05.513349

--- Row 2 ---
  id: d5128ace33cb
  title: Chuyên Viên Tuyển Sinh&CSKH
  company: CÔNG TY CỔ PHẦN VINSCHOOL
  location: Hà Nội
  salary: Thoả thuận
  job_type: 2 năm
  category: Chăm sóc khách hàng
  remote: NULL
  description: Chăm sóc khách hàng:- Tiếp nhận và xử lý yêu cầu khách hàng qua tất cả các kênh ...
  requirements: NULL
  url: https://www.topcv.vn/viec-lam/chuyen-vien-tuyen-sinh-cskh/1867757.html?ta_source...
  source: topcv
  background_image: https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80
  created_at: 2026-02-05T14:44:12.034559
  raw_data: {"id": "d5128ace33cb", "title": "Chuyên Viên Tuyển Sinh&CSKH", "company": "CÔNG ...
  crawled_at: 2026-02-05T15:19:05.514349


============================================================
TABLE: instructors
============================================================
Columns: id, name, username, avatar, category, verified, created_at

--- Row 1 ---
  id: 1
  name: Steve Jobs
  username: steve.marketing
  avatar: /image/instructors/steve-jobs.jpg
  category: Marketing
  verified: 1
  created_at: 2026-02-20T10:31:19.300263

--- Row 2 ---
  id: 2
  name: Warren Buffett
  username: warren.finance
  avatar: /image/instructors/warren-buffett.jpg
  category: Finance
  verified: 1
  created_at: 2026-02-20T10:31:19.301299


============================================================
TABLE: stories
============================================================
Columns: id, user_name, user_username, image, has_unseen, created_at

--- Row 1 ---
  id: 1
  user_name: Steve Jobs
  user_username: steve.marketing
  image: /image/instructors/steve-jobs.jpg
  has_unseen: 1
  created_at: 2026-02-20T10:31:19.301299

--- Row 2 ---
  id: 2
  user_name: Warren Buffett
  user_username: warren.finance
  image: /image/instructors/warren-buffett.jpg
  has_unseen: 1
  created_at: 2026-02-20T10:31:19.301299


============================================================
TABLE: companies
============================================================
Columns: id, name, logo, industry, size, location, created_at

--- Row 1 ---
  id: company-1
  name: TechViet Solutions
  logo: /image/steve-jobs.jpg
  industry: Technology
  size: 100-500
  location: Hà Nội
  created_at: 2026-02-20T10:31:19.301299

--- Row 2 ---
  id: company-2
  name: VinaTech Group
  logo: /image/warren-buffet.jpg
  industry: Software Development
  size: 500-1000
  location: Hồ Chí Minh
  created_at: 2026-02-20T10:31:19.301299


============================================================
TABLE: posts
============================================================
Columns: id, author_id, time, content, image, tags, likes, comments, category, quiz_question, quiz_options, quiz_correct_id, quiz_explanation, created_at

--- Row 1 ---
  id: 1
  author_id: 1
  time: 3 hours ago
  content: Marketing isn't about selling. It's about connecting.

The best products don't n...
  image: /image/posts/focus-study.jpg
  tags: ["marketing", "designthinking", "innovation"]
  likes: 45200
  comments: 36
  category: Marketing
  quiz_question: Which line best reflects the idea in this post?
  quiz_options: [{"id": "a", "label": "A", "text": "Marketing is about persuasion through discou...
  quiz_correct_id: b
  quiz_explanation: The post emphasizes solving real customer problems before pitching.
  created_at: 2026-02-20T10:31:19.301299

--- Row 2 ---
  id: 2
  author_id: 2
  time: 5 hours ago
  content: Rule #1: Never lose money.
Rule #2: Never forget Rule #1.

Compounding is the 8t...
  image: /image/topics/finance.jpg
  tags: ["investing", "personalfinance", "wealth"]
  likes: 67800
  comments: 74
  category: Finance
  quiz_question: What makes compounding powerful?
  quiz_options: [{"id": "a", "label": "A", "text": "Starting early and staying consistent."}, {"...
  quiz_correct_id: a
  quiz_explanation: Consistent contributions over time let compound growth do the heavy lifting.
  created_at: 2026-02-20T10:31:19.301299


============================================================
TABLE: practice_questions
============================================================
Columns: id, topic, title, question, options, correct_option_id, explanation, image, created_at

--- Row 1 ---
  id: practice-1
  topic: IELTS
  title: Quick Check · IELTS Speaking
  question: What is the benefit of the 3-second pause before answering?
  options: [{"id": "p1-a", "label": "A", "text": "It helps you sound more confident and org...
  correct_option_id: p1-a
  explanation: A short pause reduces filler words and lets you organize your response.
  image: /image/practice/ielts-speaking.jpg
  created_at: 2026-02-20T10:31:19.301299

--- Row 2 ---
  id: practice-2
  topic: Design
  title: Swipe Practice · UX Basics
  question: Which principle best matches 'good design is invisible'?
  options: [{"id": "p2-a", "label": "A", "text": "Focus on user goals before visuals."}, {"...
  correct_option_id: p2-a
  explanation: If users reach their goals effortlessly, the design stays out of the way.
  image: /image/practice/design-invisible.jpg
  created_at: 2026-02-20T10:31:19.301299
