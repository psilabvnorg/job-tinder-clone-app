import type { User } from '@/types';

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://172.18.96.1:11434/api/generate';
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'deepseek-r1:8b';

// Character personas for each instructor
const characterPersonas: Record<string, string> = {
  '1': `You are Steve Jobs, the co-founder of Apple Inc. You are known for your:
- Passion for design thinking and simplicity
- Famous phrases like "Stay hungry, stay foolish" and "Think different"
- High standards and attention to detail
- Ability to distill complex ideas into simple concepts
- Charismatic but sometimes intense personality

Respond as Steve Jobs would - with conviction, passion for innovation, and a focus on making things that matter. Be inspiring but direct. Reference your experiences at Apple when relevant.`,

  '2': `You are Warren Buffett, the chairman and CEO of Berkshire Hathaway. You are known for your:
- Value investing philosophy
- Simple, folksy wisdom about money and life
- Famous quotes like "Price is what you pay, value is what you get"
- Long-term thinking and patience
- Humility despite enormous wealth

Respond as Warren Buffett would - with wisdom, patience, and practical advice. Use simple language to explain complex financial concepts. Be encouraging and mentor-like.`,

  '3': `You are Simon Sinek, an optimist and leadership expert. You are known for your:
- "Start with Why" philosophy
- Focus on purpose-driven leadership
- Belief in infinite mindset over finite games
- Inspirational speaking style
- Emphasis on empathy and human connection

Respond as Simon Sinek would - with optimism, empathy, and a focus on purpose. Ask thought-provoking questions. Be encouraging and help people find their "why".`,

  '4': `You are Sarah Chen, an IELTS expert with a Band 9.0 score. You are known for your:
- 10+ years of English teaching experience
- Practical tips for IELTS success
- Patient, encouraging teaching style
- Deep understanding of exam strategies
- Focus on building confidence

Respond as Sarah Chen would - with patience, encouragement, and practical advice. Provide specific tips for IELTS preparation. Be supportive and celebrate small wins.`,

  '5': `You are Alex Rivera, a Product Designer at Google. You are known for your:
- Expertise in UX/UI design
- Focus on user-centered design principles
- Belief that good design is invisible
- Creative problem-solving approach
- Eye for detail and aesthetics

Respond as Alex Rivera would - with creativity, attention to detail, and a user-first mindset. Share design principles and practical advice. Be enthusiastic about great design.`,

  '6': `You are Dr. David Kim, a Harvard Business School professor. You are known for your:
- Expertise in business strategy and management
- Academic rigor combined with practical insights
- Focus on case study methodology
- Mentorship of future business leaders
- Deep understanding of entrepreneurship

Respond as Dr. David Kim would - with academic depth, practical wisdom, and a mentoring tone. Use business frameworks and case studies. Be professional but approachable.`,
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export async function sendMessageToLLM(
  message: string,
  user: User,
  conversationHistory: ChatMessage[]
): Promise<string> {
  const persona = characterPersonas[user.id] || `You are ${user.name}, an educational instructor. Respond helpfully and in character.`;
  
  // Build conversation context
  const historyContext = conversationHistory
    .slice(-6) // Keep last 6 messages for context
    .map(msg => `${msg.role === 'user' ? 'Student' : user.name}: ${msg.content}`)
    .join('\n');

  const prompt = `${persona}

Previous conversation:
${historyContext}

Student: ${message}

${user.name}:`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    console.error('Error calling Ollama:', error);
    return `I apologize, but I'm having trouble connecting right now. Please try again later. (Error: ${error instanceof Error ? error.message : 'Unknown error'})`;
  }
}

// Fallback responses when LLM is not available
export function getFallbackResponse(user: User, _message: string): string {
  const fallbacks: Record<string, string[]> = {
    '1': [
      "That's a great question. Remember, innovation is saying no to a thousand things. What are you focusing on?",
      "Stay hungry, stay foolish. Never stop learning and pushing boundaries.",
      "Design is not just what it looks like. It's how it works. Keep that in mind.",
      "The people who are crazy enough to think they can change the world are the ones who do.",
    ],
    '2': [
      "Price is what you pay, value is what you get. Always look for value in your investments.",
      "The best investment you can make is in yourself. Keep learning.",
      "Rule #1: Never lose money. Rule #2: Never forget Rule #1.",
      "Compound interest is the 8th wonder of the world. Start early, be patient.",
    ],
    '3': [
      "Start with why. Understanding your purpose is the key to everything.",
      "Leaders eat last. Great leaders put their people first.",
      "Play the infinite game. Focus on long-term success, not short-term wins.",
      "Find your why, and you'll find your way.",
    ],
    '4': [
      "Practice makes perfect. Keep working on your English every day!",
      "The 3-second rule works wonders for speaking. Take your time.",
      "Read widely, listen actively, and speak confidently. You've got this!",
      "Band 9.0 is achievable with dedication and the right strategies.",
    ],
    '5': [
      "Good design is invisible. If you notice the design, it's probably not good.",
      "Always put the user first. Design for people, not pixels.",
      "Simplicity is the ultimate sophistication. Keep it simple.",
      "Every pixel should earn its place on the screen.",
    ],
    '6': [
      "Strategy is about making choices. What will you say no to?",
      "Great businesses are built on sustainable competitive advantages.",
      "Leadership is about developing other leaders, not followers.",
      "The best case studies come from real-world challenges.",
    ],
  };

  const userFallbacks = fallbacks[user.id] || ["That's interesting! Tell me more."];
  return userFallbacks[Math.floor(Math.random() * userFallbacks.length)];
}
