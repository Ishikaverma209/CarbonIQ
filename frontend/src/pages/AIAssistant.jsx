import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSend, FiCpu, FiUser } from 'react-icons/fi';

const QUICK_TOPICS = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'food', label: 'Food', icon: '🥗' },
  { id: 'energy', label: 'Energy', icon: '💡' },
  { id: 'waste', label: 'Waste', icon: '♻️' },
  { id: 'water', label: 'Water', icon: '💧' },
];

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! I'm your AI sustainability coach. Ask me anything about reducing your carbon footprint, or tap a topic below to get started.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const message = text || input;
    if (!message.trim() || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await axios.post(`${apiUrl}/api/ai/chat`, { message });
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (error) {
      console.error('AI API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: "Sorry, I'm having trouble connecting. Please try again or ask about transport, food, energy, waste, or water topics.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page"
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        paddingTop: '100px',
        minHeight: '100vh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '600',
              marginBottom: '4px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            AI Assistant
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
            Your personal sustainability coach, powered by AI
          </p>
        </div>

        {/* Topic buttons */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => sendMessage(`Tell me about ${topic.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>

        {/* Chat container */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Messages area */}
          <div
            style={{
              padding: '20px',
              minHeight: '350px',
              maxHeight: '450px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '10px',
                }}
              >
                {msg.role === 'ai' && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FiCpu size={14} color="white" />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius:
                      msg.role === 'user'
                        ? '12px 12px 4px 12px'
                        : '12px 12px 12px 4px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    background:
                      msg.role === 'user'
                        ? 'rgba(20, 184, 166, 0.12)'
                        : 'var(--bg-tertiary)',
                    border:
                      msg.role === 'user'
                        ? '1px solid rgba(20, 184, 166, 0.2)'
                        : '1px solid var(--border-subtle)',
                    color:
                      msg.role === 'user' ? 'var(--accent)' : 'var(--text-primary)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.text}
                </div>

                {msg.role === 'user' && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FiUser size={14} color="var(--text-muted)" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FiCpu size={14} color="white" />
                </div>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px 12px 12px 4px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--text-muted)',
                          animation: `pulse 1.4s infinite ${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '10px',
            }}
          >
            <input
              placeholder="Ask about sustainability..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-tertiary)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                border: 'none',
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: input.trim() && !loading ? 'white' : 'var(--text-muted)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>

        {/* Info card */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px 20px',
            borderRadius: '10px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px' }}>🌱</span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              AI-Powered Insights
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            This assistant uses Google Gemini AI to provide personalized sustainability advice. 
            Ask about transport, food, energy, waste, or water to get started.
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
