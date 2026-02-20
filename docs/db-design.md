-- ============================================
-- USERS & PROFILES
-- ============================================
-- Minimal user info - most fields optional for quick signup
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL, -- Only required field
  full_name TEXT,
  avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_active_at TEXT DEFAULT (datetime('now'))
);

-- Optional profile data - filled gradually as user engages
CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,
  current_role TEXT, -- What they do now
  years_experience INTEGER,
  top_skills TEXT, -- JSON array - max 5 skills
  cv_text TEXT, -- For CV Fixer feature
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- JOBS & COMPANIES
-- ============================================
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  description TEXT,
  website TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  company_id TEXT,
  title TEXT NOT NULL,
  company TEXT NOT NULL, -- Denormalized for quick access
  location TEXT,
  salary TEXT,
  job_type TEXT, -- Full-time, Part-time, Contract
  remote INTEGER DEFAULT 0, -- Boolean: 0 or 1
  category TEXT,
  description TEXT,
  requirements TEXT, -- JSON array or comma-separated
  benefits TEXT, -- JSON array or comma-separated
  background_image TEXT,
  url TEXT UNIQUE,
  source TEXT, -- TopCV, VietnamWorks, etc.
  posted_date TEXT,
  expiry_date TEXT,
  status TEXT DEFAULT 'active', -- active, expired, filled
  created_at TEXT DEFAULT (datetime('now')),
  crawled_at TEXT,
  raw_data TEXT, -- JSON for additional fields
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);

-- ============================================
-- USER JOB INTERACTIONS (Swipe History)
-- ============================================
CREATE TABLE user_job_swipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  action TEXT NOT NULL, -- 'saved', 'passed', 'applied'
  swiped_at TEXT DEFAULT (datetime('now')),
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE(user_id, job_id)
);

CREATE INDEX idx_swipes_user ON user_job_swipes(user_id);
CREATE INDEX idx_swipes_action ON user_job_swipes(action);

-- ============================================
-- LEARNING HUB - INSTRUCTORS & CONTENT
-- ============================================
CREATE TABLE instructors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  category TEXT, -- Design, Finance, Marketing, Leadership, MBA, IELTS
  verified INTEGER DEFAULT 0,
  bio TEXT,
  rating REAL DEFAULT 0.0,
  total_lessons INTEGER DEFAULT 0,
  mentoring_hours INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  expertise TEXT, -- JSON array of expertise areas
  social_links TEXT, -- JSON object {linkedin, twitter, website}
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_instructors_category ON instructors(category);
CREATE INDEX idx_instructors_verified ON instructors(verified);

-- Educational posts from instructors
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  post_type TEXT DEFAULT 'standard', -- standard, quiz, poll, carousel, video
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  category TEXT, -- Design, Finance, Marketing, Leadership, MBA, IELTS
  tags TEXT, -- JSON array
  difficulty TEXT, -- beginner, intermediate, advanced
  estimated_read_time INTEGER, -- in minutes
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  posted_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (author_id) REFERENCES instructors(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_featured ON posts(is_featured);
CREATE INDEX idx_posts_published ON posts(is_published);

-- Quiz data embedded in posts
CREATE TABLE post_quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON array of {id, label, text}
  correct_option_id TEXT NOT NULL,
  explanation TEXT,
  comment_prompt TEXT,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ============================================
-- USER INTERACTIONS WITH CONTENT
-- ============================================
CREATE TABLE user_post_likes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  liked_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE user_post_bookmarks (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  bookmarked_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE user_post_shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  share_method TEXT, -- link, social, email
  shared_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  parent_comment_id INTEGER, -- For nested replies
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);

-- User follows instructors
CREATE TABLE user_instructor_follows (
  user_id TEXT NOT NULL,
  instructor_id TEXT NOT NULL,
  followed_at TEXT DEFAULT (datetime('now')),
  notifications_enabled INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, instructor_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- User enrolls in learning tracks
CREATE TABLE user_track_enrollments (
  user_id TEXT NOT NULL,
  track_id TEXT NOT NULL,
  enrolled_at TEXT DEFAULT (datetime('now')),
  progress_percentage INTEGER DEFAULT 0,
  completed_at TEXT,
  last_accessed_at TEXT,
  PRIMARY KEY (user_id, track_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (track_id) REFERENCES learning_tracks(id) ON DELETE CASCADE
);

-- User lesson progress
CREATE TABLE user_lesson_progress (
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  last_position TEXT, -- For video/content position
  completed_at TEXT,
  PRIMARY KEY (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- ============================================
-- LEARNING TRACKS & PRACTICE
-- ============================================
CREATE TABLE learning_tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- Design, Finance, Marketing, Leadership, MBA, IELTS
  level TEXT, -- beginner, intermediate, advanced
  instructor_id TEXT,
  lessons_count INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  duration_hours INTEGER, -- estimated completion time
  thumbnail_url TEXT,
  color TEXT, -- UI color theme
  prerequisites TEXT, -- JSON array of required track IDs
  learning_outcomes TEXT, -- JSON array of outcomes
  is_published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL
);

CREATE INDEX idx_tracks_category ON learning_tracks(category);
CREATE INDEX idx_tracks_level ON learning_tracks(level);
CREATE INDEX idx_tracks_published ON learning_tracks(is_published);

-- Individual lessons within learning tracks
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Markdown or HTML content
  video_url TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  resources TEXT, -- JSON array of downloadable resources
  is_free INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (track_id) REFERENCES learning_tracks(id) ON DELETE CASCADE
);

CREATE INDEX idx_lessons_track ON lessons(track_id);
CREATE INDEX idx_lessons_order ON lessons(order_index);

-- Practice questions for learning
CREATE TABLE practice_questions (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  category TEXT, -- Design, Finance, Marketing, Leadership, MBA, IELTS
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON array [{id, text}]
  correct_option_id TEXT NOT NULL,
  explanation TEXT,
  image_url TEXT,
  difficulty TEXT, -- easy, medium, hard
  points INTEGER DEFAULT 10,
  time_limit_seconds INTEGER,
  tags TEXT, -- JSON array
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_practice_topic ON practice_questions(topic);
CREATE INDEX idx_practice_category ON practice_questions(category);
CREATE INDEX idx_practice_difficulty ON practice_questions(difficulty);

CREATE TABLE user_practice_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_option_id TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  attempted_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES practice_questions(id) ON DELETE CASCADE
);

CREATE TABLE practice_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  time_estimate TEXT,
  progress INTEGER DEFAULT 0,
  tasks TEXT, -- JSON array
  status TEXT DEFAULT 'active', -- active, completed, paused
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- ADVISOR / MENTOR SYSTEM
-- ============================================
CREATE TABLE advisors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT, -- CEO, Investor, Entrepreneur, Designer, etc.
  style TEXT, -- Communication style description
  headline TEXT,
  summary TEXT,
  focus TEXT, -- JSON array of focus areas
  voice TEXT, -- JSON array of voice characteristics
  accent_color TEXT, -- UI theme color
  quote TEXT, -- Signature quote
  badge TEXT, -- Badge/icon identifier
  image_url TEXT,
  expertise_areas TEXT, -- JSON array
  conversation_starters TEXT, -- JSON array of suggested questions
  response_templates TEXT, -- JSON array of response patterns
  personality_traits TEXT, -- JSON object {trait: description}
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_advisors_active ON advisors(is_active);
CREATE INDEX idx_advisors_sort ON advisors(sort_order);

-- Advisor conversation history
CREATE TABLE advisor_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  advisor_id TEXT NOT NULL,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  context TEXT, -- JSON object with conversation context
  rating INTEGER, -- User rating of response (1-5)
  is_helpful INTEGER, -- Boolean feedback
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (advisor_id) REFERENCES advisors(id) ON DELETE CASCADE
);

CREATE INDEX idx_conversations_user ON advisor_conversations(user_id);
CREATE INDEX idx_conversations_advisor ON advisor_conversations(advisor_id);

-- Pre-generated advisor advice/content
CREATE TABLE advisor_content (
  id TEXT PRIMARY KEY,
  advisor_id TEXT NOT NULL,
  content_type TEXT NOT NULL, -- tip, insight, quote, case_study, advice
  title TEXT,
  content TEXT NOT NULL,
  category TEXT, -- career, leadership, innovation, strategy, etc.
  tags TEXT, -- JSON array
  context_triggers TEXT, -- JSON array of when to show this content
  is_featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (advisor_id) REFERENCES advisors(id) ON DELETE CASCADE
);

CREATE INDEX idx_advisor_content_type ON advisor_content(content_type);
CREATE INDEX idx_advisor_content_category ON advisor_content(category);
CREATE INDEX idx_advisor_content_advisor ON advisor_content(advisor_id);

-- ============================================
-- CV FIXER / PROFILE IMPROVEMENTS
-- ============================================
CREATE TABLE cv_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  cv_text TEXT NOT NULL,
  impact_score INTEGER DEFAULT 0,
  advice TEXT, -- JSON array of suggestions
  created_at TEXT DEFAULT (datetime('now')),
  is_current INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cv_improvements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cv_version_id INTEGER NOT NULL,
  section TEXT, -- summary, experience, skills, etc.
  original_text TEXT,
  improved_text TEXT,
  improvement_type TEXT, -- metrics, strong_verbs, ats_optimization
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (cv_version_id) REFERENCES cv_versions(id) ON DELETE CASCADE
);

-- ============================================
-- STORIES (Feed Feature)
-- ============================================
CREATE TABLE stories (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL, -- Can be instructor or user
  creator_type TEXT DEFAULT 'instructor', -- instructor, user
  media_type TEXT DEFAULT 'image', -- image, video
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  duration_seconds INTEGER DEFAULT 5,
  link_url TEXT, -- Swipe-up link
  views_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT, -- Stories expire after 24h
  FOREIGN KEY (creator_id) REFERENCES instructors(id) ON DELETE CASCADE
);

CREATE INDEX idx_stories_expires ON stories(expires_at);
CREATE INDEX idx_stories_creator ON stories(creator_id);

-- Track which users have viewed stories
CREATE TABLE story_views (
  story_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  viewed_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (story_id, user_id),
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- CHAT / MESSAGING (Future feature)
-- ============================================
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  user1_id TEXT NOT NULL,
  user2_id TEXT NOT NULL,
  last_message_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  sent_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- ============================================
-- USER ACTIVITY & ANALYTICS
-- ============================================
CREATE TABLE user_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- job_view, job_save, post_like, lesson_complete
  entity_id TEXT, -- ID of job, post, lesson, etc.
  metadata TEXT, -- JSON for additional data
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activity_user ON user_activity(user_id);
CREATE INDEX idx_activity_type ON user_activity(activity_type);

-- ============================================
-- USER PREFERENCES & SETTINGS
-- ============================================
CREATE TABLE user_preferences (
  user_id TEXT PRIMARY KEY,
  -- Job preferences
  preferred_categories TEXT, -- JSON array
  preferred_locations TEXT, -- JSON array
  salary_min TEXT,
  salary_max TEXT,
  remote_only INTEGER DEFAULT 0,
  job_types TEXT, -- JSON array
  -- Learning preferences
  learning_interests TEXT, -- JSON array of categories
  learning_level TEXT, -- beginner, intermediate, advanced
  daily_learning_goal_minutes INTEGER DEFAULT 30,
  -- Notification settings
  notification_settings TEXT, -- JSON {email, push, in_app}
  -- UI preferences
  theme TEXT DEFAULT 'light', -- light, dark, auto
  language TEXT DEFAULT 'en',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- CONTENT GENERATION METADATA
-- ============================================
-- Track generated content for quality control
CREATE TABLE content_generation_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL, -- post, question, advisor_response, lesson
  content_id TEXT NOT NULL,
  generation_method TEXT, -- manual, ai_generated, template
  prompt_used TEXT,
  model_version TEXT,
  quality_score REAL,
  reviewed INTEGER DEFAULT 0,
  reviewer_notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_gen_log_type ON content_generation_log(content_type);
CREATE INDEX idx_gen_log_reviewed ON content_generation_log(reviewed);

-- Content templates for generation
CREATE TABLE content_templates (
  id TEXT PRIMARY KEY,
  template_type TEXT NOT NULL, -- post, quiz, advisor_response, lesson
  category TEXT,
  name TEXT NOT NULL,
  description TEXT,
  template_structure TEXT NOT NULL, -- JSON structure
  variables TEXT, -- JSON array of required variables
  example_output TEXT,
  usage_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_templates_type ON content_templates(template_type);
CREATE INDEX idx_templates_category ON content_templates(category);
