import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMessageCircle,
  FiArrowRight,
  FiTrendingUp,
  FiZap,
  FiTarget,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

const insights = [
  "Your carbon footprint is trending 12% lower than last week. Great progress!",
  "Switching your Tuesday commute to cycling could save 2.1 kg CO₂ monthly.",
  "You've saved the equivalent of 3 trees this month. Keep it up!",
  "Your food choices this week were 15% more sustainable than average.",
];

const weeklyStats = {
  saved: 8.4,
  target: 12,
  streak: 5,
  rank: 23,
};

const recommendations = [
  {
    title: "Try Bike Commuting",
    description: "Replace 2 bus rides with cycling this week to save 4.2 kg CO₂.",
    impact: "High",
    potential: "4.2 kg",
  },
  {
    title: "Meatless Monday",
    description: "Swap beef for plant-based protein to reduce food footprint by 2.5 kg.",
    impact: "Medium",
    potential: "2.5 kg",
  },
];

const AIInsightsHero = ({ userName, totalSaved }) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] = useState(0);

  const firstName = userName?.split(' ')[0] || 'there';

  useEffect(() => {
    const text = insights[currentInsight];
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [currentInsight]);

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % insights.length);
  };

  const progressPercent = (weeklyStats.saved / weeklyStats.target) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '32px',
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, #14B8A6 0%, #3B82F6 50%, #8B5CF6 100%)',
        opacity: 0.8,
      }} />

      <div style={{ padding: '28px 32px' }}>
        {/* Header with AI branding */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)',
            }}>
              <FiMessageCircle color="white" size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>
                  AI Carbon Assistant
                </h2>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#14B8A6',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Live
                </span>
              </div>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-tertiary)',
                margin: 0,
                marginTop: '2px',
              }}>
                Personalized sustainability coach
              </p>
            </div>
          </div>

          <Link
            to="/assistant"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'var(--accent-muted)',
              color: 'var(--accent)',
              fontSize: '13px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            Open Chat
            <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Main content grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          {/* Left column - Insight + Score */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Today's Insight */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}>
                <FiZap size={14} color="#F59E0B" />
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Today's Insight
                </span>
              </div>

              <div style={{
                minHeight: '48px',
                marginBottom: '12px',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      style={{ color: 'var(--accent)' }}
                    >
                      |
                    </motion.span>
                  )}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <button
                  onClick={nextInsight}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Next insight
                </button>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {insights.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === currentInsight ? '16px' : '6px',
                        height: '6px',
                        borderRadius: '3px',
                        background: i === currentInsight ? 'var(--accent)' : 'var(--border-default)',
                        transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Carbon Score */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}>
                <FiTarget size={14} color="#14B8A6" />
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Your Carbon Score
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '12px',
                marginBottom: '16px',
              }}>
                <span style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}>
                  {Math.round(100 - (totalSaved || 0) * 0.5)}
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                }}>
                  / 100
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
              }}>
                <FiTrendingUp size={14} color="#10B981" />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#10B981',
                }}>
                  +12 points this month
                </span>
              </div>
            </div>
          </div>

          {/* Right column - Progress + Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Weekly Progress */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Weekly Progress
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}>
                  {weeklyStats.streak} day streak
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                marginBottom: '16px',
              }}>
                <span style={{
                  fontSize: '32px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {weeklyStats.saved} kg
                </span>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}>
                  of {weeklyStats.target} kg target
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                height: '6px',
                borderRadius: '3px',
                background: 'var(--border-subtle)',
                marginBottom: '12px',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: '100%',
                    borderRadius: '3px',
                    background: 'linear-gradient(90deg, #14B8A6 0%, #2DD4BF 100%)',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}>
                  {Math.round(progressPercent)}% complete
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--accent)',
                  fontWeight: '500',
                }}>
                  {(weeklyStats.target - weeklyStats.saved).toFixed(1)} kg to go
                </span>
              </div>
            </div>

            {/* Recommended Action */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}>
                <FiAlertCircle size={14} color="#3B82F6" />
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Recommended Action
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRecommendation}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <FiCheckCircle size={16} color="#3B82F6" />
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        margin: 0,
                        marginBottom: '4px',
                      }}>
                        {recommendations[selectedRecommendation].title}
                      </h4>
                      <p style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        lineHeight: '1.5',
                      }}>
                        {recommendations[selectedRecommendation].description}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#F59E0B',
                      }}>
                        {recommendations[selectedRecommendation].impact} Impact
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                      }}>
                        Save {recommendations[selectedRecommendation].potential}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedRecommendation((prev) => (prev + 1) % recommendations.length)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        color: '#3B82F6',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Next action
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer with intelligence indicators */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '3px',
                background: '#10B981',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}>
                AI analyzing your patterns
              </span>
            </div>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}>
              Updated 2 min ago
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}>
              Based on {weeklyStats.streak} days of data
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsightsHero;
