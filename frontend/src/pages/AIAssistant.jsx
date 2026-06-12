import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCpu, FiUser, FiTrendingDown, FiZap, FiTarget } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { isBackendAvailable } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || '';

const QUICK_TOPICS = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'food', label: 'Food', icon: '🥗' },
  { id: 'energy', label: 'Energy', icon: '💡' },
  { id: 'waste', label: 'Waste', icon: '♻️' },
  { id: 'water', label: 'Water', icon: '💧' },
  { id: 'goals', label: 'Set Goals', icon: '🎯' },
];

const AI_RESPONSES = {
  transport: {
    text: `**Transport & Carbon Emissions**

Road transport accounts for ~75% of global transport emissions. Here's what matters:

**Car vs Alternatives:**
- Average car: 0.21 kg CO₂/km
- Bus: 0.089 kg CO₂/km (58% less)
- Train: 0.041 kg CO₂/km (80% less)
- Bicycle: 0 kg CO₂/km

**Quick wins:**
• Combine errands into one trip — saves 15-20% fuel
• Maintain tire pressure — improves efficiency by 3%
• Remote work 2 days/week saves ~1.6 tonnes CO₂/year
• For flights under 500km, trains emit 80% less

**Pro tip:** Track your commute in CarbonIQ to see your weekly transport footprint. Most people underestimate it by 40%.`,
    tips: ['Log your commute', 'Try cycling once a week', 'Carpool with colleagues'],
  },
  food: {
    text: `**Food Carbon Footprint**

The food system produces 26-34% of global greenhouse gases. What you eat matters more than where it comes from.

**Highest to lowest impact:**
• Beef: 27 kg CO₂/kg (highest)
• Cheese: 13.5 kg CO₂/kg
• Pork: 12.1 kg CO₂/kg
• Chicken: 6.9 kg CO₂/kg
• Rice: 4.0 kg CO₂/kg
• Vegetables: 0.4 kg CO₂/kg (lowest)

**Practical steps:**
• Meatless Monday saves ~100 kg CO₂/year
• Reducing beef to 1x/week saves 340 kg CO₂/year
• Seasonal produce cuts transport emissions by 50%
• Food waste = 8-10% of global emissions — plan meals

**Biggest lever:** Shifting from beef to chicken for one meal saves 20 kg CO₂.`,
    tips: ['Try Meatless Monday', 'Plan meals to reduce waste', 'Choose seasonal produce'],
  },
  energy: {
    text: `**Home Energy Efficiency**

Residential energy produces ~20% of direct emissions. Heating/cooling is the biggest factor.

**Where your energy goes:**
• Heating/cooling: 40-50%
• Water heating: 15-20%
• Appliances: 15-20%
• Lighting: 10-15%

**High-impact changes:**
• Smart thermostat: saves 10-15% on heating/cooling
• LED bulbs: use 75% less energy than incandescent
• Improve insulation: reduces heating needs by 25-30%
• Energy-efficient appliances: save 20-50% per appliance

**Quick wins:**
• Unplug "vampire" devices — they use 5-10% of home energy
• Wash clothes in cold water — saves 90% of washing energy
• Air dry dishes and clothes when possible

**Track it:** Log your electricity and gas usage monthly in CarbonIQ to spot trends.`,
    tips: ['Install a smart thermostat', 'Switch to LED bulbs', 'Unplug standby devices'],
  },
  waste: {
    text: `**Waste & Circular Economy**

Only 13.5% of global waste is recycled. Landfill produces methane — 28x more potent than CO₂.

**Waste hierarchy (most to least impactful):**
1. Refuse — avoid what you don't need
2. Reduce — consume less
3. Reuse — extend product life
4. Recycle — process materials
5. Rot — compost organic waste

**Key facts:**
• 1 tonne of recycled paper saves 17 trees
• Composting diverts 30% of household waste from landfill
• Fast fashion: 10% of global emissions (more than aviation)
• Electronics: 50M tonnes of e-waste per year

**Practical actions:**
• Carry reusable bags, bottles, containers
• Buy secondhand when possible
• Compost food scraps — reduces methane
• Choose products with minimal packaging`,
    tips: ['Start composting', 'Buy secondhand', 'Refuse single-use plastics'],
  },
  water: {
    text: `**Water & Carbon Footprint**

Water treatment and heating use significant energy. Most household water footprint is "hidden" in products.

**Direct water carbon:**
• Hot water shower: 2.5 kg CO₂ per 10 minutes
• Hot bath: 3.5 kg CO₂ per bath
• Washing machine (hot): 2.0 kg CO₂ per load

**Hidden water footprint:**
• 1 kg beef = 15,400 liters of water
• 1 cotton t-shirt = 2,700 liters
• 1 cup of coffee = 140 liters
• 1 smartphone = 12,760 liters

**Quick wins:**
• Shorter showers: saves 40 liters and 1 kg CO₂
• Fix dripping taps: wastes 20 liters/day
• Full loads only: dishwasher and washing machine
• Cold water wash: saves 90% of washing energy`,
    tips: ['Take shorter showers', 'Fix leaky faucets', 'Wash clothes in cold water'],
  },
  goals: {
    text: `**Setting Effective Carbon Goals**

The most impactful goals are specific, measurable, and time-bound.

**Goal framework:**
1. **Baseline:** Track everything for 2 weeks first
2. **Identify:** Find your top 3 emission categories
3. **Set targets:** 10-20% reduction per category
4. **Track weekly:** Log activities consistently
5. **Review monthly:** Adjust targets based on data

**Recommended goals for beginners:**
• Week 1-2: Log all activities daily
• Month 1: Reduce one category by 15%
• Month 3: Achieve 30-day logging streak
• Month 6: Reduce total footprint by 25%

**Advanced goals:**
• Reach carbon score of 80+
• Earn 10+ badges
• Complete 5 challenges
• Help 3 friends start tracking

**Remember:** Consistency beats perfection. Logging daily matters more than one big change.`,
    tips: ['Start with a 2-week baseline', 'Focus on your top emission category', 'Set a 30-day streak goal'],
  },
};

const getAIResponse = (message) => {
  const lower = message.toLowerCase();

  if (lower.match(/\b(transport|car|bus|train|flight|commute|drive|bike|cycling)\b/)) {
    return AI_RESPONSES.transport;
  }
  if (lower.match(/\b(food|eat|diet|meat|beef|chicken|vegan|vegetarian|dairy|meal)\b/)) {
    return AI_RESPONSES.food;
  }
  if (lower.match(/\b(energy|electric|heat|power|solar|thermostat|light|gas)\b/)) {
    return AI_RESPONSES.energy;
  }
  if (lower.match(/\b(waste|recycle|compost|trash|landfill|plastic|reuse)\b/)) {
    return AI_RESPONSES.waste;
  }
  if (lower.match(/\b(water|shower|bath|tap|leak|irrigation)\b/)) {
    return AI_RESPONSES.water;
  }
  if (lower.match(/\b(goal|target|plan|track|streak|badge|challenge|progress|milestone)\b/)) {
    return AI_RESPONSES.goals;
  }
  if (lower.match(/\b(hello|hi|hey|good morning|good afternoon)\b/)) {
    return {
      text: "Hello! I'm your AI sustainability coach. I can help with:\n\n• **Transport** — reducing commute emissions\n• **Food** — making lower-carbon food choices\n• **Energy** — cutting home energy use\n• **Waste** — reducing and recycling better\n• **Water** — saving water and its carbon impact\n• **Goals** — setting effective sustainability targets\n\nAsk about any topic, or tap the buttons below!",
      tips: ['Pick a topic to explore', 'Log your first activity', 'Set a weekly goal'],
    };
  }
  if (lower.match(/\b(thank|thanks|thx)\b/)) {
    return {
      text: "You're welcome! Every question you ask shows you're committed to understanding your impact. That awareness is the first step toward meaningful change.\n\nKeep tracking your activities in CarbonIQ — consistency is key!",
      tips: ['Log today\'s activities', 'Share what you learned', 'Set a new goal'],
    };
  }
  if (lower.match(/\b(help|how|what can|what do)\b/)) {
    return {
      text: "I can help you with:\n\n**Learn** about carbon footprints in each category\n**Get tips** for reducing your impact\n**Set goals** and track your progress\n**Understand** the data behind sustainability\n\nJust ask something like:\n• \"How can I reduce my transport emissions?\"\n• \"What foods have the lowest carbon footprint?\"\n• \"How do I set effective carbon goals?\"",
      tips: ['Ask about a specific topic', 'Check your dashboard stats', 'Try the carbon calculator'],
    };
  }

  return {
    text: `Great question! Here's what I can help with:\n\n**Categories:**\n• Transport (cars, flights, commuting)\n• Food (diet, meal planning, food waste)\n• Energy (home efficiency, electricity)\n• Waste (recycling, composting)\n• Water (conservation, hidden footprint)\n\n**Or ask about:**\n• Setting carbon reduction goals\n• Understanding your carbon score\n• Making sustainable lifestyle changes\n\nTry asking about a specific category for detailed advice!`,
    tips: ['Pick a topic from the buttons above', 'Ask about transport or food', 'Explore goal setting'],
  };
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm your AI sustainability coach. Ask me anything about reducing your carbon footprint, or tap a topic below.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const message = text || input;
    if (!message.trim() || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setInput('');
    setLoading(true);

    // Try backend first (Gemini AI), fall back to client-side
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [...prev, { role: 'ai', text: data.reply, source: data.source }]);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Backend unavailable, use client-side fallback
      }
    }

    // Client-side fallback
    setTimeout(() => {
      const response = getAIResponse(message);
      setMessages((prev) => [...prev, { role: 'ai', text: response.text, tips: response.tips }]);
      setLoading(false);
    }, 600 + Math.random() * 800);
  };

  return (
    <div className="page" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '100px', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiCpu size={18} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                AI Sustainability Coach
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                Personalized insights for your carbon journey
              </p>
            </div>
          </div>
        </div>

        {/* Quick topic buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => sendMessage(`Tell me about ${topic.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-secondary)', cursor: 'pointer',
                fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>

        {/* Chat container */}
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          {/* Messages */}
          <div style={{ padding: '20px', minHeight: '400px', maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '10px' }}
                >
                  {msg.role === 'ai' && (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <FiCpu size={14} color="white" />
                    </div>
                  )}
                  <div style={{ maxWidth: '78%' }}>
                    <div style={{
                      padding: '14px 18px',
                      borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      fontSize: '14px', lineHeight: '1.7',
                      background: msg.role === 'user' ? 'rgba(20, 184, 166, 0.1)' : 'var(--bg-tertiary)',
                      border: msg.role === 'user' ? '1px solid rgba(20, 184, 166, 0.2)' : '1px solid var(--border-subtle)',
                      color: msg.role === 'user' ? 'var(--accent)' : 'var(--text-primary)',
                      whiteSpace: 'pre-line',
                    }}>
                      {msg.text.split('\n').map((line, j) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <div key={j} style={{ fontWeight: '700', marginBottom: '4px', marginTop: j > 0 ? '8px' : '0', fontSize: '15px' }}>{line.replace(/\*\*/g, '')}</div>;
                        }
                        if (line.startsWith('• ') || line.startsWith('- ')) {
                          return <div key={j} style={{ paddingLeft: '8px', marginBottom: '2px' }}>{line}</div>;
                        }
                        return <div key={j}>{line}</div>;
                      })}
                    </div>
                    {/* Tips */}
                    {msg.tips && msg.tips.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {msg.tips.map((tip, j) => (
                          <span key={j} style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500',
                            background: 'rgba(20, 184, 166, 0.06)', border: '1px solid rgba(20, 184, 166, 0.1)',
                            color: 'var(--accent)',
                          }}>
                            {tip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <FiUser size={14} color="var(--text-muted)" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FiCpu size={14} color="white" />
                </div>
                <div style={{
                  padding: '14px 18px', borderRadius: '14px 14px 14px 4px',
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)',
                        animation: `pulse 1.4s infinite ${i * 0.2}s`,
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Analyzing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '16px 20px', borderTop: '1px solid var(--border-subtle)',
            display: 'flex', gap: '10px',
          }}>
            <input
              placeholder="Ask about sustainability..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-tertiary)', fontSize: '14px',
                color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '44px', height: '44px', borderRadius: '8px', border: 'none',
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: input.trim() && !loading ? 'white' : 'var(--text-muted)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              }}
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
          {[
            { icon: <FiTrendingDown size={16} />, label: 'Log Activity', desc: 'Track your footprint', to: '/calculator', color: '#3B82F6' },
            { icon: <FiTarget size={16} />, label: 'Set Goals', desc: 'Plan your targets', to: '/challenges', color: '#10B981' },
            { icon: <FiZap size={16} />, label: 'View Dashboard', desc: 'See your progress', to: '/dashboard', color: '#F59E0B' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.to}
              style={{
                padding: '16px', borderRadius: '10px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = `${action.color}40`}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
            >
              <div style={{ color: action.color, marginBottom: '8px' }}>{action.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{action.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{action.desc}</div>
            </Link>
          ))}
        </div>
      </motion.div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }`}</style>
    </div>
  );
};

export default AIAssistant;
