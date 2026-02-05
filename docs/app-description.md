# JobSwipe - Product Description & UI/UX User Flow

## Product Overview

**JobSwipe** is a modern career development web application that combines three powerful features:
1. **Job Swipe** - Tinder-style job discovery interface
2. **Career Advice Lounge** - AI-powered mentorship from iconic business leaders
3. **Profile & CV Fixer** - Interactive CV editor with real-time feedback and chat assistant

---

## Target Users

- Job seekers actively looking for new opportunities
- Professionals wanting to improve their CV/resume
- Career changers seeking guidance and mentorship
- Recent graduates entering the job market

---

## UI/UX User Flow

### 1. Landing & First Impression

#### Entry Point
```
User opens JobSwipe → Landing page loads
```

#### Visual Hierarchy
1. **Header Section**
   - Logo: "JobSwipe" (prominent, top-left)
   - Tagline: "Career guidance + CV upgrades"
   - Clean, minimal design establishes trust

2. **Page Layout**
   - Single-page scrollable design
   - Three distinct sections visible via scroll
   - Consistent card-based UI pattern

---

### 2. Job Swipe Feature Flow

#### 2.1 Initial State
```
User scrolls to Job Swipe section
↓
Stats bar displays: Saved (0) | Remaining (5) | Passed (0)
↓
First job card appears with depth effect (next card visible behind)
```

#### 2.2 Job Card Interaction

**Card Content Display:**
- Job title (prominent)
- Company name
- Location with icon (📍)
- Remote badge if applicable (🏠)
- Salary range (highlighted)
- Job description (2-3 sentences)
- Requirements tags (skill pills)
- Swipe hint at bottom

**Swipe Gestures:**
```
Option A: Drag card left
↓
"PASS ✗" indicator appears (opacity increases with drag distance)
↓
Release beyond threshold (-100px)
↓
Card animates out left with rotation
↓
Job added to "Passed" list
↓
Next card slides into view

Option B: Drag card right
↓
"SAVE ✓" indicator appears (opacity increases with drag distance)
↓
Release beyond threshold (+100px)
↓
Card animates out right with rotation
↓
Job added to "Saved" list
↓
Saved Jobs section updates below
↓
Next card slides into view
```

**Button Alternative:**
```
User clicks "✗ Pass" button → Same as swipe left
User clicks "✓ Save" button → Same as swipe right
```

#### 2.3 Saved Jobs Management
```
User saves a job
↓
"Saved Jobs" section appears/updates below swipe deck
↓
Saved job displays as compact card (title + company)
↓
Color-coded by original job card accent
```

#### 2.4 End of Deck
```
User swipes through all jobs
↓
Empty state message: "No more jobs to swipe!"
↓
"Start Over" button appears
↓
User clicks → Deck resets, counters reset
```

---

### 3. Career Advice Lounge Flow

#### 3.1 Advisor Selection
```
User scrolls to Career Advice Lounge section
↓
Three advisor cards displayed horizontally:
- Steve Jobs (Product Visionary) - Coral accent
- Warren Buffett (Long-Term Strategist) - Yellow accent  
- Elon Musk (First-Principles Builder) - Mint accent
↓
First advisor (Steve Jobs) selected by default
```

#### 3.2 Advisor Interaction
```
User clicks on advisor card
↓
Card highlights with "active" state
↓
Detail panel below updates with:
- Headline quote
- Summary paragraph
- Two-column layout:
  - Left: "Actionable Focus" (3 bullet points)
  - Right: "Signature Tone" (3 bullet points)
- Disclaimer note
```

#### 3.3 Content Consumption
```
User reads advisor content
↓
Can switch between advisors freely
↓
Each advisor provides unique perspective:
- Jobs: Simplicity, storytelling, craft
- Buffett: Long-term value, relationships, fundamentals
- Musk: First principles, speed, ambition
```

---

### 4. Profile & CV Fixer Flow

#### 4.1 CV Editor
```
User scrolls to Profile & CV Fixer section
↓
Two-column card layout:
- Left: "Your CV" textarea (pre-filled with sample)
- Right: "CV Advice" panel
```

#### 4.2 CV Editing & Real-time Feedback
```
User edits CV text in textarea
↓
System analyzes CV content in real-time
↓
"CV Advice" panel updates with contextual suggestions:
- Length assessment
- Metrics recommendation
- Portfolio link suggestion
- Summary section advice
- Skills ordering tip
↓
Badge indicates "✨ LLM-generated critique"
```

#### 4.3 Fix-it Chat Assistant
```
User views chat card below CV editor
↓
Initial AI message displayed:
"Share what role you're targeting and I'll help rewrite bullet points with stronger impact."
↓
Rotating prompt suggestions shown:
- "Ask me to rewrite a bullet."
- "Share the role you are targeting."
- "Need a tighter summary?"
```

#### 4.4 Chat Interaction
```
User types message in chat input
↓
Presses Enter or clicks "Send" button
↓
User message appears in chat log (right-aligned, user style)
↓
Brief delay (300ms) for natural feel
↓
AI response appears (left-aligned, AI style)
↓
Contextual responses based on keywords:
- "rewrite/bullet" → Specific bullet rewrite suggestion
- "summary/profile" → Summary writing help
- "skills" → Skills organization advice
- Other → Prompts for role targeting
```

---

## Interaction Patterns

### Gestures & Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Swipe job | Mouse drag | Touch drag |
| Select advisor | Click | Tap |
| Edit CV | Type in textarea | Type in textarea |
| Send chat | Enter key or click | Tap Send button |

### Visual Feedback

| State | Feedback |
|-------|----------|
| Card dragging | Card follows cursor with rotation |
| Swipe threshold reached | Indicator opacity at 100% |
| Advisor selected | Card border/highlight active |
| Chat sending | Message appears immediately |
| AI responding | 300ms delay, then message appears |

### Color System

| Element | Color | Purpose |
|---------|-------|---------|
| Steve Jobs card | #FFE9E6 (Coral) | Warm, creative |
| Warren Buffett card | #FFF8DA (Yellow) | Stable, trustworthy |
| Elon Musk card | #E9FAF7 (Mint) | Fresh, innovative |
| Job cards | Varied accents | Visual distinction |
| Pass action | Red tones | Negative/skip |
| Save action | Green tones | Positive/keep |

---

## User Journey Scenarios

### Scenario 1: Active Job Seeker
```
1. Opens JobSwipe
2. Immediately engages with Job Swipe
3. Swipes through 5 jobs, saves 2
4. Reviews saved jobs list
5. Scrolls to CV Fixer
6. Pastes own CV
7. Reviews AI suggestions
8. Uses chat to refine bullet points
9. Copies improved CV
```

### Scenario 2: Career Guidance Seeker
```
1. Opens JobSwipe
2. Scrolls to Career Advice Lounge
3. Reads Steve Jobs advice
4. Switches to Warren Buffett for different perspective
5. Takes notes on actionable focus items
6. Applies insights to CV in Fixer section
```

### Scenario 3: CV Improvement Focus
```
1. Opens JobSwipe
2. Scrolls directly to CV Fixer
3. Pastes existing CV
4. Reviews automated critique
5. Opens chat, asks for bullet rewrite
6. Iterates on suggestions
7. Asks for summary help
8. Finalizes improved CV
```

---

## Accessibility Considerations

- Keyboard navigation support for all interactive elements
- Button alternatives for swipe gestures
- Clear visual hierarchy and contrast
- Readable font sizes
- Touch-friendly tap targets (mobile)
- Screen reader compatible structure

---

## Future Enhancement Opportunities

1. **Job Swipe**
   - Filter by location, salary, remote
   - Job detail expansion view
   - Apply directly integration
   - Save to external job boards

2. **Career Advice**
   - Interactive Q&A with advisors
   - Personalized advice based on CV
   - More advisor personas

3. **CV Fixer**
   - Multiple CV templates
   - Export to PDF
   - LinkedIn import
   - ATS compatibility checker
   - Real LLM integration for deeper analysis

---

## Technical Notes

- Built with React + Vite
- Single-page application
- Responsive design
- Client-side state management
- Mock data for demonstration
- Simulated AI responses (rule-based)
