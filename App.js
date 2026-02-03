import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const advisors = [
  {
    name: 'Steve Jobs',
    title: 'Product Visionary',
    style: 'Focus on clarity, simplicity, and storytelling.',
    headline: 'Design your career like a product launch.',
    summary:
      'Obsess over the experience you create for users. Remove everything that is not essential. Build a career narrative that people can feel.',
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
    accent: '#FFE9E6'
  },
  {
    name: 'Warren Buffett',
    title: 'Long-Term Strategist',
    style: 'Build compounding value through patience and trust.',
    headline: 'Invest in yourself before any role.',
    summary:
      'Choose companies with durable cultures and leaders who respect craft. Focus on steady growth, not short-term hype.',
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
    accent: '#FFF8DA'
  },
  {
    name: 'Elon Musk',
    title: 'First-Principles Builder',
    style: 'Ambitious, technical, and mission-obsessed.',
    headline: 'Pick the hardest problems and move faster.',
    summary:
      'If the mission energizes you, obsess over the fundamentals and iterate relentlessly. Speed and curiosity beat credentials.',
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
    accent: '#E9FAF7'
  }
];

const defaultCv = `Alex Morgan
Product Designer | alexmorgan.design | Austin, TX

Experience
- Lead product designer at NextWave (2020–Present)
  • Led redesign of onboarding, improved activation by 26%
  • Built a design system with 42 reusable components
- UX designer at Harbor Labs (2017–2020)
  • Shipped 4 major mobile releases with cross-functional team

Skills
Figma, Design Systems, UX Research, Prototyping, HTML/CSS

Education
BA in Visual Design, University of Texas`;

const chatPrompts = [
  'Ask me to rewrite a bullet.',
  'Share the role you are targeting.',
  'Need a tighter summary?'
];

const generateChatResponse = (prompt) => {
  const lower = prompt.toLowerCase();
  if (lower.includes('rewrite') || lower.includes('bullet')) {
    return 'Try: "Led a cross-functional redesign that lifted activation by 26% and reduced onboarding time by 18%."';
  }
  if (lower.includes('summary') || lower.includes('profile')) {
    return 'Summary idea: "Product designer focused on growth and onboarding flows, delivering measurable lifts in activation and retention."';
  }
  if (lower.includes('skills')) {
    return 'Group skills by category: "Product Design, Research, Systems" to improve scanability.';
  }
  return 'Tell me the role you want and I will tailor your headline and bullet points.';
};

const generateCvAdvice = (text) => {
  const advice = [];
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 80) {
    advice.push('Add more measurable outcomes so recruiters see your impact quickly.');
  } else {
    advice.push('Strong length—now tighten each bullet to one crisp achievement.');
  }
  if (!/metrics|%|\d+/.test(text)) {
    advice.push('Include metrics (%, $ or time saved) to quantify results.');
  }
  if (!/portfolio|case study|github|behance|dribbble/i.test(text)) {
    advice.push('Add a portfolio or case study link near your header.');
  }
  if (!/summary|profile|objective/i.test(text)) {
    advice.push('Add a 2-3 line summary targeting your ideal role.');
  }
  advice.push('Reorder skills to match the top job description keywords.');
  return advice;
};

export default function App() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(0);
  const [cvText, setCvText] = useState(defaultCv);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      role: 'ai',
      text: "Share what role you're targeting and I'll help rewrite bullet points with stronger impact."
    }
  ]);

  const adviceList = useMemo(() => generateCvAdvice(cvText), [cvText]);
  const advisor = advisors[selectedAdvisor];

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const prompt = chatInput.trim();
    setChatLog((prev) => [...prev, { role: 'user', text: prompt }]);
    setChatInput('');
    setTimeout(() => {
      setChatLog((prev) => [...prev, { role: 'ai', text: generateChatResponse(prompt) }]);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>JobSwipe</Text>
          <Text style={styles.subtitle}>Career guidance + CV upgrades across web, iOS, and Android</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Advice Lounge</Text>
          <Text style={styles.sectionSubtitle}>
            LLM-styled mentorship inspired by Steve Jobs, Warren Buffett, and Elon Musk.
          </Text>
          <View style={styles.advisorRow}>
            {advisors.map((item, index) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.advisorCard,
                  { backgroundColor: item.accent },
                  index === selectedAdvisor && styles.advisorCardActive
                ]}
                onPress={() => setSelectedAdvisor(index)}
              >
                <Text style={styles.advisorName}>{item.name}</Text>
                <Text style={styles.advisorTitle}>{item.title}</Text>
                <Text style={styles.advisorStyle}>{item.style}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.advisorDetail}>
            <Text style={styles.advisorHeadline}>{advisor.headline}</Text>
            <Text style={styles.advisorSummary}>{advisor.summary}</Text>
            <View style={styles.detailColumns}>
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>Actionable Focus</Text>
                {advisor.focus.map((item) => (
                  <Text key={item} style={styles.detailBullet}>
                    • {item}
                  </Text>
                ))}
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>Signature Tone</Text>
                {advisor.voice.map((item) => (
                  <Text key={item} style={styles.detailBullet}>
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.disclaimer}>
              Advice is generated for inspiration and does not represent real-world endorsements.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile & CV Fixer</Text>
          <Text style={styles.sectionSubtitle}>
            Preview your CV, get instant critique, and chat with a fixer assistant.
          </Text>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your CV</Text>
              <TextInput
                multiline
                value={cvText}
                onChangeText={setCvText}
                style={styles.cvInput}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✨ LLM-generated critique</Text>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>CV Advice</Text>
              {adviceList.map((item) => (
                <Text key={item} style={styles.detailBullet}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.chatCard}>
            <View style={styles.chatHeader}>
              <Text style={styles.cardTitle}>Fix-it Chat</Text>
              <Text style={styles.chatSub}>
                {chatPrompts[Math.floor(Date.now() / 1000) % chatPrompts.length]}
              </Text>
            </View>
            <View style={styles.chatLog}>
              {chatLog.map((entry, index) => (
                <View
                  key={`${entry.role}-${index}`}
                  style={[styles.chatBubble, entry.role === 'user' ? styles.chatUser : styles.chatAi]}
                >
                  <Text style={styles.chatText}>{entry.text}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chatInputRow}>
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Ask for a rewrite or new section..."
                style={styles.chatInput}
              />
              <TouchableOpacity style={styles.primaryButton} onPress={handleSend}>
                <Text style={styles.primaryButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC'
  },
  page: {
    padding: 20,
    paddingBottom: 60
  },
  header: {
    marginBottom: 24
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6B6B'
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#7F8C9A'
  },
  section: {
    marginBottom: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50'
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C9A',
    marginTop: 6,
    marginBottom: 14
  },
  advisorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  advisorCard: {
    padding: 12,
    borderRadius: 16,
    minWidth: 160,
    flexGrow: 1
  },
  advisorCardActive: {
    borderWidth: 2,
    borderColor: '#4ECDC4'
  },
  advisorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50'
  },
  advisorTitle: {
    fontSize: 12,
    color: '#2C3E50',
    marginTop: 4
  },
  advisorStyle: {
    fontSize: 12,
    color: '#2C3E50',
    marginTop: 8
  },
  advisorDetail: {
    marginTop: 16
  },
  advisorHeadline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50'
  },
  advisorSummary: {
    marginTop: 6,
    color: '#4D5B6A',
    lineHeight: 20
  },
  detailColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12
  },
  detailCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 16,
    padding: 12,
    flexGrow: 1,
    minWidth: 200
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 6
  },
  detailBullet: {
    fontSize: 13,
    color: '#4D5B6A',
    marginBottom: 6,
    lineHeight: 18
  },
  disclaimer: {
    marginTop: 10,
    fontSize: 11,
    color: '#7F8C9A'
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  card: {
    backgroundColor: '#F7F9FC',
    borderRadius: 16,
    padding: 12,
    flexGrow: 1,
    minWidth: 240
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2C3E50'
  },
  cvInput: {
    minHeight: 200,
    borderRadius: 12,
    borderColor: '#E3E7ED',
    borderWidth: 1,
    padding: 10,
    fontSize: 13,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF'
  },
  badge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FFE66D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeText: {
    fontSize: 11,
    color: '#2C3E50',
    fontWeight: '600'
  },
  chatCard: {
    marginTop: 16,
    backgroundColor: '#F7F9FC',
    borderRadius: 16,
    padding: 12
  },
  chatHeader: {
    marginBottom: 8
  },
  chatSub: {
    fontSize: 12,
    color: '#7F8C9A'
  },
  chatLog: {
    gap: 8,
    marginBottom: 10
  },
  chatBubble: {
    padding: 10,
    borderRadius: 14,
    maxWidth: '92%'
  },
  chatUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFE9E6'
  },
  chatAi: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9FAF7'
  },
  chatText: {
    fontSize: 13,
    color: '#2C3E50'
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E3E7ED',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#FFFFFF'
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  }
});
