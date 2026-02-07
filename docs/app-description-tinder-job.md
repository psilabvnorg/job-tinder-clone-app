# JobSwipe - Career Development Platform

## Overview

**JobSwipe** is a modern career development web application that helps you discover jobs, get career advice, and improve your CV/resume.

## Key Features

### 1. Job Swipe
Swipe through job listings Tinder-style:
- View job title, company, location, salary, and description
- Swipe left to **PASS** ✗ on jobs you're not interested in
- Swipe right or click **SAVE** ✓ to bookmark jobs
- Track your stats: Saved jobs, remaining jobs, passed jobs

### 2. Career Advice Lounge
Get mentorship from iconic business leaders:
- **Steve Jobs** - Focus on creativity and simplicity
- **Warren Buffett** - Long-term strategy and value
- **Elon Musk** - First principles and innovation
- Each advisor provides actionable insights and signature advice

### 3. CV Fixer
Improve your CV with AI-powered suggestions:
- Paste your current CV
- Get real-time AI feedback and suggestions
- Chat with an AI assistant to refine your bullet points
- Get tips on length, metrics, summary, and skills

## Target Users

- Job seekers looking for new opportunities
- Professionals improving their CV/resume
- Career changers seeking guidance
- Recent graduates entering the job market

## How to Use

### Job Swipe
1. Scroll to the Job Swipe section
2. See your first job card
3. Swipe left (PASS) or right (SAVE) - or use the buttons
4. Review your saved jobs below the swipe deck

### Career Advice
1. Scroll to Career Advice Lounge
2. Click on an advisor card to view their advice
3. Read actionable insights and signature tone
4. Switch between advisors for different perspectives

### CV Fixer
1. Scroll to CV Fixer section
2. Paste your CV in the text area
3. Read AI suggestions on the right
4. Use the chat to ask AI questions like:
   - "Rewrite this bullet point"
   - "What role am I targeting?"
   - "Help with my summary"

## Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Backend**: Node.js Express
- **AI Responses**: Rule-based (simulated)

## File Structure

```
src/
├── components/
│   ├── JobSwipe.jsx           # Main job swipe component
│   ├── AdvisorPage.jsx        # Career advice lounge
│   ├── CVFixerPage.jsx        # CV editor and chat
│   ├── ChatPage.jsx           # Chat interface
│   └── ...
├── data/
│   └── jobs.json              # Sample job data
├── services/
│   └── database.js            # Data management
└── hooks/
    └── useJobs.js             # Custom hook for jobs
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Color System

- **Steve Jobs (Advisor)**: Coral - Creative, warm
- **Warren Buffett (Advisor)**: Yellow - Trustworthy, stable
- **Elon Musk (Advisor)**: Mint - Fresh, innovative
- **SAVE/Like**: Green - Positive action
- **PASS/Skip**: Red - Negative action

## Future Enhancements

1. **Job Swipe**
   - Filter by location, salary, remote status
   - Job detail expansion
   - Direct apply integration

2. **Career Advice**
   - Interactive Q&A with advisors
   - Personalized advice based on CV
   - More advisor personas

3. **CV Fixer**
   - Multiple CV templates
   - PDF export
   - LinkedIn import
   - ATS compatibility checker
   - Real LLM integration

## Accessibility

- Keyboard navigation support
- Button alternatives for swipe gestures
- Clear visual hierarchy and contrast
- Touch-friendly controls on mobile
