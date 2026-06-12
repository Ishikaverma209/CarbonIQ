import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingDown, FiZap, FiTarget, FiAward, FiBarChart2, FiShield } from 'react-icons/fi';
import Logo from '../components/Logo';
import { FootprintIcon } from '../components/FootprintTrail';

const features = [
  { icon: <FiTrendingDown size={20} />, title: 'Track Everything', description: 'Log transport, food, energy, and waste in seconds with smart categorization.', color: '#3B82F6' },
  { icon: <FiZap size={20} />, title: 'AI Insights', description: 'Get personalized recommendations powered by sustainability science.', color: '#F59E0B' },
  { icon: <FiTarget size={20} />, title: 'Set Goals', description: 'Define targets and track your progress with visual milestones.', color: '#10B981' },
  { icon: <FiAward size={20} />, title: 'Earn Rewards', description: 'Unlock badges and levels as you build sustainable habits.', color: '#8B5CF6' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Product Manager', quote: 'CarbonIQ made me realize how much my commute impacted the planet. I switched to cycling and saved 2.4 tonnes CO₂ this year.' },
  { name: 'Marcus Webb', role: 'Software Engineer', quote: 'The AI insights are incredible. It suggested simple changes I never thought of that reduced my footprint by 35%.' },
  { name: 'Elena Rodriguez', role: 'Sustainability Lead', quote: 'We deployed CarbonIQ across our team. The gamification makes sustainability fun and measurable.' },
];

const JOURNEY_MILESTONES = [
  { label: 'Start', icon: '🌱', reached: true },
  { label: 'Week 1', icon: '🌿', reached: true },
  { label: 'Month 1', icon: '🌳', reached: true },
  { label: '3 Months', icon: '💪', reached: false },
  { label: '6 Months', icon: '⚡', reached: false },
  { label: '1 Year', icon: '🌍', reached: false },
];

const Landing = () => {
  const heroFootprints = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 42 + Math.sin(i * 0.8) * 12,
    y: 15 + i * 5.5,
    rotation: -20 + Math.sin(i * 0.6) * 14,
    size: 14 + (14 - i) * 1.5,
    opacity: 0.12 + (i / 14) * 0.18,
    delay: 0.5 + i * 0.08,
    isLeft: i % 2 === 0,
  }));

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden', background: '#0A0A0A' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '140px 32px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Ambient gradient */}
        <div style={{
          position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '700px',
          background: 'radial-gradient(ellipse, rgba(20, 184, 166, 0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Floating particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`p-${i}`}
            style={{
              position: 'absolute',
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${1.5 + Math.random() * 2}px`,
              height: `${1.5 + Math.random() * 2}px`,
              borderRadius: '50%',
              background: '#14B8A6',
              pointerEvents: 'none',
            }}
            animate={{ y: [0, -25, 0], opacity: [0, 0.2, 0] }}
            transition={{ duration: 6 + Math.random() * 8, delay: Math.random() * 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Animated footprint trail flowing upward */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {heroFootprints.map((fp) => (
            <motion.div
              key={fp.id}
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={{ opacity: fp.opacity, y: 0, scale: 1 }}
              transition={{ delay: fp.delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                left: `${fp.x}%`,
                top: `${fp.y}%`,
                transform: `rotate(${fp.rotation}deg)`,
              }}
            >
              <FootprintIcon size={fp.size} color="#14B8A6" />
            </motion.div>
          ))}

          {/* Glowing trail line */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="heroTrailGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0" />
                <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 48% 15% Q 52% 20% 46% 25% Q 54% 30% 48% 35% Q 55% 40% 47% 45% Q 53% 50% 49% 55% Q 54% 60% 48% 65% Q 52% 70% 50% 75%"
              stroke="url(#heroTrailGrad)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: 0.8, ease: 'easeOut' }}
            />
          </svg>
        </div>

        <div style={{ position: 'relative', textAlign: 'center' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(20, 184, 166, 0.06)', border: '1px solid rgba(20, 184, 166, 0.12)',
              marginBottom: '32px',
            }}
          >
            <FootprintIcon size={10} color="#14B8A6" />
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#14B8A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Carbon Intelligence Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: '700', color: '#E8EAED',
              lineHeight: '1.1', letterSpacing: '-0.03em', marginBottom: '24px',
            }}
          >
            Every step toward
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 50%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
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
            style={{ fontSize: '18px', color: '#6B7280', maxWidth: '520px', margin: '0 auto 40px', lineHeight: '1.7' }}
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
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 28px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                color: 'white', fontSize: '15px', fontWeight: '600', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)', transition: 'all 0.2s',
              }}
            >
              Start Free <FiArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 28px', borderRadius: '10px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                color: '#9AA0A6', fontSize: '15px', fontWeight: '500', textDecoration: 'none',
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
            style={{ marginTop: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}
          >
            {[
              { value: '12,400+', label: 'Users' },
              { value: '4.2M', label: 'kg CO₂ tracked' },
              { value: '89%', label: 'Reduced footprint' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#E8EAED', marginBottom: '2px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#E8EAED', marginBottom: '12px' }}>
            Everything you need to reduce your impact
          </h2>
          <p style={{ fontSize: '15px', color: '#6B7280', maxWidth: '480px', margin: '0 auto' }}>
            Powerful tools designed for individuals and teams serious about sustainability.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ borderColor: `${feature.color}30`, y: -2 }}
              style={{
                padding: '28px 24px', borderRadius: '12px',
                background: '#111111', border: '1px solid rgba(255,255,255,0.04)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: `${feature.color}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: feature.color,
                marginBottom: '16px',
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#E8EAED', marginBottom: '8px' }}>{feature.title}</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey Visualization Section */}
      <section style={{ padding: '80px 32px', maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: '48px', borderRadius: '16px',
            background: 'linear-gradient(180deg, #111111 0%, #0A0A0A 100%)',
            border: '1px solid rgba(255,255,255,0.04)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Background footprint trail */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.15 + (i / 10) * 0.15 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  left: `${-30 + Math.sin(i * 0.7) * 20}px`,
                  top: `${i * 45}px`,
                  transform: `rotate(${-12 + Math.sin(i * 0.5) * 10}deg)`,
                }}
              >
                <FootprintIcon size={16 + (10 - i) * 1.5} color="#14B8A6" />
              </motion.div>
            ))}
          </div>

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#E8EAED', marginBottom: '12px' }}>
              Your Sustainability Journey
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>
              Every action you log extends your journey trail. Watch your progress grow.
            </p>

            {/* Journey milestones with footprint icons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '40px', flexWrap: 'wrap' }}>
              {JOURNEY_MILESTONES.map((milestone, i) => (
                <div key={milestone.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      style={{
                        width: i === 5 ? '52px' : '40px', height: i === 5 ? '52px' : '40px',
                        borderRadius: '50%',
                        background: milestone.reached ? 'rgba(20, 184, 166, 0.12)' : 'rgba(255,255,255,0.02)',
                        border: `2px solid ${milestone.reached ? '#14B8A6' : 'rgba(255,255,255,0.06)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 8px',
                        boxShadow: i === 5 ? '0 0 24px rgba(20, 184, 166, 0.15)' : 'none',
                      }}
                    >
                      {milestone.reached ? (
                        <FootprintIcon size={i === 5 ? 18 : 14} color="#14B8A6" />
                      ) : (
                        <div style={{ fontSize: '14px' }}>{milestone.icon}</div>
                      )}
                    </motion.div>
                    <span style={{ fontSize: '11px', color: milestone.reached ? '#9AA0A6' : '#5F6368', fontWeight: i === 5 ? '600' : '400' }}>
                      {milestone.label}
                    </span>
                  </div>
                  {i < 5 && (
                    <div style={{
                      width: '36px', height: '2px', marginBottom: '20px',
                      background: i < 4 ? 'linear-gradient(90deg, #14B8A6, rgba(20, 184, 166, 0.3))' : 'rgba(255,255,255,0.04)',
                      borderRadius: '1px',
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {[
                { label: 'Carbon Score', value: '72/100', color: '#14B8A6' },
                { label: 'Current Streak', value: '14 days', color: '#F59E0B' },
                { label: 'Badges Earned', value: '8/24', color: '#8B5CF6' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: '16px 24px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                  textAlign: 'center', minWidth: '120px',
                }}>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#5F6368' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works - Footprint Trail Section */}
      <section style={{ padding: '80px 32px', maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#E8EAED', marginBottom: '12px' }}>
            Your first steps to a greener future
          </h2>
          <p style={{ fontSize: '15px', color: '#6B7280', maxWidth: '480px', margin: '0 auto' }}>
            Three simple steps to start making an impact today.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { step: '01', title: 'Create Account', desc: 'Sign up in seconds and set your sustainability baseline.', icon: <FiShield size={20} />, color: '#3B82F6' },
            { step: '02', title: 'Log Activities', desc: 'Track transport, food, energy, and waste with our smart calculator.', icon: <FiBarChart2 size={20} />, color: '#10B981' },
            { step: '03', title: 'See Your Impact', desc: 'Watch your carbon score improve as you build green habits.', icon: <FiTrendingDown size={20} />, color: '#14B8A6' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              style={{
                padding: '32px 24px', borderRadius: '12px',
                background: '#111111', border: '1px solid rgba(255,255,255,0.04)',
                textAlign: 'center', position: 'relative',
              }}
            >
              {/* Step number with footprint */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: `${item.color}10`, border: `1px solid ${item.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', position: 'relative',
              }}>
                {item.icon}
                <div style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: item.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: '700', color: 'white',
                }}>
                  {item.step}
                </div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#E8EAED', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>{item.desc}</p>

              {/* Connecting footprint trail between steps */}
              {i < 2 && (
                <div style={{
                  position: 'absolute', right: '-20px', top: '50%',
                  transform: 'translateY(-50%)', display: 'flex', gap: '4px',
                }}>
                  {[0, 1, 2].map((j) => (
                    <FootprintIcon key={j} size={7} color="#14B8A6" opacity={0.35 - j * 0.08} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#E8EAED', marginBottom: '12px' }}>
            Trusted by sustainability leaders
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: '28px', borderRadius: '12px',
                background: '#111111', border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <p style={{ fontSize: '14px', color: '#9AA0A6', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: '600', color: 'white',
                }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#E8EAED' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: '#5F6368' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section with footprint trail */}
      <section style={{ padding: '80px 32px', maxWidth: '800px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: '60px 48px', borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%)',
            border: '1px solid rgba(20, 184, 166, 0.12)',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Animated footprint trail in CTA */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.15 + i * 0.02 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  position: 'absolute',
                  right: `${20 + i * 18}px`,
                  bottom: `${30 + i * 15}px`,
                  transform: `rotate(${-25 + i * 8}deg)`,
                }}
              >
                <FootprintIcon size={10 + i * 2} color="#14B8A6" />
              </motion.div>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#E8EAED', marginBottom: '12px' }}>
              Start your journey today
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
              Join thousands making a measurable difference. Free forever.
            </p>
            <Link
              to="/register"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 32px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                color: 'white', fontSize: '15px', fontWeight: '600', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
              }}
            >
              Create Free Account <FiArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#5F6368' }}>
          CarbonIQ — Carbon Intelligence for a better world.
        </p>
      </footer>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }`}</style>
    </div>
  );
};

export default Landing;
