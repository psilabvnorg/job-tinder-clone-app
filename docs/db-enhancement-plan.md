# Database Enhancement Plan

## Current State Analysis

### Existing Database: `public/data/jobs.db`
**Current Schema:**
```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary TEXT,
  job_type TEXT,
  category TEXT,
  remote INTEGER DEFAULT 0,
  description TEXT,
  requirements TEXT,
  url TEXT UNIQUE,
  source TEXT,
  background_image TEXT,
  created_at TEXT,
  raw_data TEXT,
  crawled_at TEXT
)
```

**Status:** ✅ Working - Contains crawled job data from TopCV/VietnamWorks

---

## Enhancement Strategy

### Phase 1: Extend Existing Database (Quick Wins)
**Goal:** Add new tables to existing `jobs.db` without breaking current functionality

#### 1.1 Add Core Content Tables
```sql
-- Instructors for Learning Hub
CREATE TABLE instructors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  category TEXT,
  verified INTEGER DEFAULT 0,
  bio TEXT,
  followers_count INTEGER DEFAULT 0
);

-- Educational Posts
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  post_type TEXT DEFAULT 'standard',
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  tags TEXT,
  likes_count INTEGER DEFAULT 0,
  posted_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (author_id) REFERENCES instructors(id)
);

-- Advisors for Career Advice
CREATE TABLE advisors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  style TEXT,
  headline TEXT,
  summary TEXT,
  accent_color TEXT,
  quote TEXT,
  image_url TEXT
);

-- Practice Questions
CREATE TABLE practice_questions (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  category TEXT,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_option_id TEXT NOT NULL,
  explanation TEXT,
  image_url TEXT,
  difficulty TEXT
);
```

#### 1.2 Migration Script
Create `script/migrate-db.py` to:
- Backup existing `jobs.db`
- Add new tables without touching jobs table
- Seed initial content (instructors, advisors, sample posts)

---

### Phase 2: Content Generation System

#### 2.1 Seed Data Scripts
Create scripts to populate:

**`script/seed-instructors.py`**
- Steve Jobs (Design, Leadership)
- Warren Buffett (Finance, MBA)
- Simon Sinek (Leadership, Marketing)
- Sarah Chen (IELTS)
- Alex (Design)
- David (MBA)

**`script/seed-advisors.py`**
- Steve Jobs (Creativity & Simplicity)
- Warren Buffett (Long-term Strategy)
- Elon Musk (Innovation & First Principles)

**`script/seed-posts.py`**
- Generate 20-30 educational posts per category
- Mix of text, images, and quiz posts
- Use templates for consistency

**`script/seed-practice.py`**
- 50+ practice questions across categories
- IELTS speaking, Design principles, Finance basics, etc.

#### 2.2 Content Templates
Create `script/templates/` folder:
- `post-templates.json` - Post structures
- `quiz-templates.json` - Quiz formats
- `advisor-responses.json` - Response patterns

---

### Phase 3: User Data (Optional - For Future)

#### 3.1 Separate User Database
Create `public/data/users.db` for user-specific data:
- User profiles
- Swipe history
- Bookmarks
- Learning progress

**Why separate?**
- `jobs.db` = Read-only content (jobs, posts, instructors)
- `users.db` = User-generated data (can be cleared/reset)
- Easier to update content without affecting user data

---

## Implementation Priority

### 🔥 High Priority (Week 1)
1. ✅ Update `db-design.md` (DONE)
2. Create migration script to add new tables
3. Seed instructors (6 instructors)
4. Seed advisors (3 advisors)
5. Generate 10 sample posts per category (60 total)

### 🟡 Medium Priority (Week 2)
6. Generate 50 practice questions
7. Add post quiz data
8. Create content generation templates
9. Build admin script to generate more content

### 🟢 Low Priority (Future)
10. Separate user database
11. Content recommendation engine
12. Analytics tables
13. Real-time features (chat, notifications)

---

## File Structure After Enhancement

```
public/data/
├── jobs.db              # Main database (jobs + content)
└── users.db             # User data (future)

script/
├── migrate-db.py        # Add new tables
├── seed-instructors.py  # Populate instructors
├── seed-advisors.py     # Populate advisors
├── seed-posts.py        # Generate posts
├── seed-practice.py     # Generate questions
├── generate-content.py  # Bulk content generator
└── templates/
    ├── post-templates.json
    ├── quiz-templates.json
    └── advisor-responses.json
```

---

## Next Steps

1. **Review this plan** - Confirm approach
2. **Create migration script** - Add tables to existing DB
3. **Seed initial data** - Get content flowing
4. **Update frontend** - Connect to new tables
5. **Test & iterate** - Ensure everything works

---

## Questions to Consider

1. **Content volume:** How many posts/questions do you want initially?
2. **Content source:** Manual creation, AI generation, or templates?
3. **Update frequency:** How often will you add new content?
4. **User data:** Store locally (localStorage) or in database?

---

## Risk Mitigation

- ✅ Backup `jobs.db` before any changes
- ✅ Test migration on copy first
- ✅ Keep jobs table untouched (no breaking changes)
- ✅ Add indexes for performance
- ✅ Version control for database schema
