import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingDown, FiZap, FiTarget, FiAward } from 'react-icons/fi';
import Logo from '../components/Logo';

const features = [
  {
    icon: <FiTrendingDown size={20} />,
    title: 'Track Everything',
    description: 'Log transport, food, energy, and waste in seconds with smart categorization.',
    color: '#3B82F6',
  },
  {
    icon: <FiZap size={20} />,
    title: 'AI Insights',
    description: 'Get personalized recommendations powered by Gemini AI.',
    color: '#F59E0B',
  },
  {
    icon: <FiTarget size={20} />,
    title: 'Set Goals',
    description: 'Define targets and track your progress with visual milestones.',
    color: '#10B981',
  },
  {
    icon: <FiAward size={20} />,
    title: 'Earn Rewards',
    description: 'Unlock badges and levels as you build sustainable habits.',
    color: '#8B5CF6',
  },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Product Manager', quote: 'CarbonIQ made me realize how much my commute impacted the planet. I switched to cycling and saved 2.4 tonnes CO₂ this year.' },
  { name: 'Marcus Webb', role: 'Software Engineer', quote: 'The AI insights are incredible. It suggested simple changes I never thought of that reduced my footprint by 35%.' },
  { name: 'Elena Rodriguez', role: 'Sustainability Lead', quote: 'We deployed CarbonIQ across our team. The gamification makes sustainability fun and measurable.' },
];

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '140px 32px 100px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Background gradient */}
        <div style={{
          position: 'absolute',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(20, 184, 166, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Animated footprint trail - background */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}>
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.03 * (1 - i * 0.1), y: 0 }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
              style={{
                position: 'absolute',
                left: `${-50 + i * 12}px`,
                top: `${i * 40}px`,
                transform: `rotate(${-15 + Math.sin(i) * 5}deg)`,
              }}
            >
              <svg width="18" height="22" viewBox="0 0 24 28" fill="none">
                <path d="M6 24C6 24 4 20 4 14C4 8 6 4 8 2C10 0 12 0 13 2C14 4 14 6 14 8C14 10 12 12 10 14C8 16 6 18 6 24Z" fill="#14B8A6" />
                <path d="M14 26C14 26 16 22 16 16C16 10 14 6 14 4C14 2 16 0 18 0C20 0 22 2 22 6C22 10 20 14 18 16C16 18 14 22 14 26Z" fill="#14B8A6" opacity="0.6" />
              </svg>
            </motion.div>
          ))}
        </div>

        <div style={{ position: 'relative', textAlign: 'center' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(20, 184, 166, 0.06)',
              border: '1px solid rgba(20, 184, 166, 0.12)',
              marginBottom: '32px',
            }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#14B8A6',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#14B8A6',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Carbon Intelligence Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: '700',
              color: '#E8EAED',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
              marginBottom: '24px',
            }}
          >
            Every step toward
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 50%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              sustainability
            </span>
            {' '}starts with
            <br />
            understanding.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{
              fontSize: '18px',
              color: '#6B7280',
              maxWidth: '520px',
              margin: '0 auto 40px',
              lineHeight: '1.7',
            }}
          >
            Track your carbon footprint with precision. Get AI-powered insights.
            Make measurable changes that matter.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              Start Free
              <FiArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#9AA0A6',
                fontSize: '15px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
            }}
          >
            {[
              { value: '12,400+', label: 'Users' },
              { value: '4.2M', label: 'kg CO₂ tracked' },
              { value: '89%', label: 'Reduced footprint' },
            ].map((stat, i) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#E8EAED',
                  marginBottom: '2px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#5F6368',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '80px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#E8EAED',
            marginBottom: '12px',
          }}>
            Everything you need to reduce your impact
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6B7280',
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            Powerful tools designed for individuals and teams serious about sustainability.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ borderColor: `${feature.color}30` }}
              style={{
                padding: '28px 24px',
                borderRadius: '12px',
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: `${feature.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: feature.color,
                marginBottom: '16px',
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#E8EAED',
                marginBottom: '8px',
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.6',
              }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey Visualization Section */}
      <section style={{
        padding: '80px 32px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, #111111 0%, #0A0A0A 100%)',
            border: '1px solid rgba(255,255,255,0.04)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background footprints */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.03,
            pointerEvents: 'none',
          }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${-40 + i * 15}px`,
                  top: `${i * 50}px`,
                  transform: `rotate(${-10 + Math.sin(i * 0.7) * 8}deg)`,
                }}
              >
                <svg width="20" height="24" viewBox="0 0 24 28" fill="none">
                  <path d="M6 24C6 24 4 20 4 14C4 8 6 4 8 2C10 0 12 0 13 2C14 4 14 6 14 8C14 10 12 12 10 14C8 16 6 18 6 24Z" fill="#14B8A6" />
                  <path d="M14 26C14 26 16 22 16 16C16 10 14 6 14 4C14 2 16 0 18 0C20 0 22 2 22 6C22 10 20 14 18 16C16 18 14 22 14 26Z" fill="#14B8A6" opacity="0.6" />
                </svg>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#E8EAED',
              marginBottom: '12px',
            }}>
              Your Sustainability Journey
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '40px',
              maxWidth: '400px',
              margin: '0 auto 40px',
            }}>
              Every action you log extends your journey trail. Watch your progress grow.
            </p>

            {/* Journey visualization */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '40px',
            }}>
              {['Start', 'Week 1', 'Month 1', '3 Months', '6 Months', '1 Year'].map((milestone, i) => (
                <div key={milestone} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      style={{
                        width: i === 5 ? '48px' : '36px',
                        height: i === 5 ? '48px' : '36px',
                        borderRadius: '50%',
                        background: i <= 3 ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${i <= 3 ? '#14B8A6' : 'rgba(255,255,255,0.06)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px',
                        boxShadow: i === 5 ? '0 0 20px rgba(20, 184, 166, 0.2)' : 'none',
                      }}
                    >
                      {i <= 3 ? (
                        <svg width="12" height="14" viewBox="0 0 24 28" fill="none">
                          <path d="M6 24C6 24 4 20 4 14C4 8 6 4 8 2C10 0 12 0 13 2C14 4 14 6 14 8C14 10 12 12 10 14C8 16 6 18 6 24Z" fill="#14B8A6" />
                        </svg>
                      ) : (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                        }} />
                      )}
                    </motion.div>
                    <span style={{
                      fontSize: '11px',
                      color: i <= 3 ? '#9AA0A6' : '#5F6368',
                      fontWeight: i === 5 ? '600' : '400',
                    }}>
                      {milestone}
                    </span>
                  </div>
                  {i < 5 && (
                    <div style={{
                      width: '40px',
                      height: '2px',
                      background: i < 3 ? 'linear-gradient(90deg, #14B8A6, rgba(20, 184, 166, 0.3))' : 'rgba(255,255,255,0.04)',
                      borderRadius: '1px',
                      marginBottom: '18px',
                    }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              {[
                { label: 'Carbon Score', value: '72/100', color: '#14B8A6' },
                { label: 'Current Streak', value: '14 days', color: '#F59E0B' },
                { label: 'Badges Earned', value: '8/24', color: '#8B5CF6' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: '16px 24px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  textAlign: 'center',
                  minWidth: '120px',
                }}>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: stat.color,
                    marginBottom: '4px',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#5F6368',
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: '80px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#E8EAED',
            marginBottom: '12px',
          }}>
            Trusted by sustainability leaders
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: '28px',
                borderRadius: '12px',
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <p style={{
                fontSize: '14px',
                color: '#9AA0A6',
                lineHeight: '1.7',
                marginBottom: '20px',
                fontStyle: 'italic',
              }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#E8EAED',
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#5F6368',
                  }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 32px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: '60px 48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%)',
            border: '1px solid rgba(20, 184, 166, 0.12)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background footprints */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '40px',
            opacity: 0.03,
            transform: 'rotate(-20deg)',
            pointerEvents: 'none',
          }}>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute',
                right: `${i * 25}px`,
                bottom: `${i * 20}px`,
              }}>
                <svg width="16" height="18" viewBox="0 0 24 28" fill="none">
                  <path d="M6 24C6 24 4 20 4 14C4 8 6 4 8 2C10 0 12 0 13 2C14 4 14 6 14 8C14 10 12 12 10 14C8 16 6 18 6 24Z" fill="#14B8A6" />
                </svg>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#E8EAED',
              marginBottom: '12px',
            }}>
              Start your journey today
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              marginBottom: '32px',
              maxWidth: '400px',
              margin: '0 auto 32px',
            }}>
              Join thousands making a measurable difference. Free forever.
            </p>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
              }}
            >
              Create Free Account
              <FiArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '13px',
          color: '#5F6368',
        }}>
          CarbonIQ — Carbon Intelligence for a better world.
        </p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
