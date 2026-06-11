import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck, FiShield } from 'react-icons/fi';
import Logo from '../components/Logo';
import { FootprintIcon } from '../components/FootprintTrail';

const JOURNEY_STEPS = [
  { field: 'name', label: 'Identity', desc: 'Tell us about yourself', icon: '👤' },
  { field: 'email', label: 'Connection', desc: 'Your digital address', icon: '📧' },
  { field: 'password', label: 'Security', desc: 'Protect your account', icon: '🔒' },
  { field: 'confirm', label: 'Confirmation', desc: 'Almost there', icon: '✅' },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 2.5,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * 6,
}));

const GEOMETRIC_LINES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x1: 10 + Math.random() * 40,
  y1: 10 + Math.random() * 80,
  x2: 50 + Math.random() * 40,
  y2: 10 + Math.random() * 80,
  opacity: 0.03 + Math.random() * 0.04,
}));

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const fields = useMemo(() => [
    { key: 'name', value: name, set: setName, type: 'text', placeholder: 'Your full name', icon: FiUser, minLength: undefined },
    { key: 'email', value: email, set: setEmail, type: 'email', placeholder: 'you@example.com', icon: FiMail, minLength: undefined },
    { key: 'password', value: password, set: setPassword, type: 'password', placeholder: '••••••••', icon: FiLock, minLength: 6 },
    { key: 'confirm', value: confirm, set: setConfirm, type: 'password', placeholder: '••••••••', icon: FiLock, minLength: undefined },
  ], [name, email, password, confirm]);

  const completedCount = [name, email, password, confirm].filter(Boolean).length;
  const progress = (completedCount / 4) * 100;
  const currentStepIndex = completedCount < 4 ? completedCount : 3;

  const [emailConfirmRequired, setEmailConfirmRequired] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailConfirmRequired(false);
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const result = await register(name, email, password);
      // If Supabase requires email confirmation, user is null
      if (result && !result.user && result.identities?.length > 0) {
        setEmailConfirmRequired(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  const footprintPositions = [
    { x: 100, y: 40, rotation: -15, size: 30 },
    { x: 170, y: 100, rotation: 15, size: 28 },
    { x: 110, y: 165, rotation: -12, size: 26 },
    { x: 180, y: 230, rotation: 12, size: 24 },
    { x: 120, y: 300, rotation: -10, size: 22 },
    { x: 175, y: 365, rotation: 10, size: 20 },
    { x: 130, y: 430, rotation: -8, size: 18 },
    { x: 165, y: 495, rotation: 8, size: 17 },
    { x: 140, y: 560, rotation: -6, size: 16 },
    { x: 160, y: 620, rotation: 6, size: 15 },
    { x: 145, y: 680, rotation: -5, size: 14 },
    { x: 155, y: 740, rotation: 5, size: 13 },
    { x: 150, y: 800, rotation: -4, size: 12 },
    { x: 152, y: 860, rotation: 4, size: 11 },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0A0A0A',
    }}>
      {/* Left panel - Journey visualization */}
      <div style={{
        flex: '0 0 480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Radial gradient background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 30% 40%, rgba(20, 184, 166, 0.07) 0%, transparent 60%), radial-gradient(ellipse at 60% 80%, rgba(20, 184, 166, 0.04) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* Geometric line pattern */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {GEOMETRIC_LINES.map((line) => (
            <motion.line
              key={line.id}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="#14B8A6"
              strokeWidth="0.5"
              opacity={line.opacity}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: line.id * 0.4, ease: 'easeOut' }}
            />
          ))}
        </svg>

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              background: '#14B8A6',
              pointerEvents: 'none',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.25, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Animated footprint trail - flowing upward toward brighter future */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}>
          {footprintPositions.map((fp, i) => {
            const isActive = i < completedCount + 2;
            const progressRatio = i / (footprintPositions.length - 1);
            const brightness = 0.08 + progressRatio * 0.18;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: isActive ? brightness : brightness * 0.4,
                  y: 0,
                  scale: isActive ? 1 : 0.85,
                }}
                transition={{
                  delay: 0.2 + i * 0.08,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: 'absolute',
                  left: `${fp.x}px`,
                  top: `${fp.y}px`,
                  transform: `rotate(${fp.rotation}deg)`,
                }}
              >
                <FootprintIcon size={fp.size} color="#14B8A6" />
              </motion.div>
            );
          })}

          {/* Glowing path line connecting footprints */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <defs>
              <linearGradient id="trailGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.02" />
                <stop offset={`${Math.min(progress + 20, 100)}%`} stopColor="#14B8A6" stopOpacity="0.08" />
                <stop offset={`${Math.min(progress + 25, 100)}%`} stopColor="#14B8A6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`M 130 ${50 + 0 * 60} Q 160 ${80 + 0 * 60} 180 ${110 + 0 * 60} Q 120 ${150 + 0 * 60} 140 ${175 + 0 * 60} Q 190 ${210 + 0 * 60} 170 ${245 + 0 * 60} Q 115 ${280 + 0 * 60} 135 ${310 + 0 * 60} Q 185 ${345 + 0 * 60} 160 ${375 + 0 * 60} Q 125 ${410 + 0 * 60} 145 ${440 + 0 * 60} Q 175 ${475 + 0 * 60} 155 ${505 + 0 * 60}`}
              stroke="url(#trailGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.min(progress / 100, 1) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
        </div>

        {/* Content overlay */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ marginBottom: '48px' }}>
              <Logo size={40} showText={true} />
            </div>

            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#E8EAED',
              lineHeight: '1.2',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}>
              Begin your journey to
              <br />
              <span style={{ color: '#14B8A6' }}>carbon intelligence</span>
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              lineHeight: '1.7',
              maxWidth: '360px',
              marginBottom: '48px',
            }}>
              Every great sustainability story starts with a single step.
              Your journey toward a greener future begins now.
            </p>

            {/* Journey progress milestones */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {JOURNEY_STEPS.map((step, i) => {
                const isCompleted = i < completedCount;
                const isCurrent = i === currentStepIndex && completedCount < 4;

                return (
                  <motion.div
                    key={step.field}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: isCompleted
                        ? 'rgba(20, 184, 166, 0.08)'
                        : isCurrent
                          ? 'rgba(20, 184, 166, 0.04)'
                          : 'transparent',
                      border: `1px solid ${isCompleted ? 'rgba(20, 184, 166, 0.15)' : isCurrent ? 'rgba(20, 184, 166, 0.08)' : 'transparent'}`,
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isCompleted
                        ? 'rgba(20, 184, 166, 0.15)'
                        : 'rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      transition: 'all 0.4s ease',
                    }}>
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <FiCheck size={14} color="#14B8A6" />
                        </motion.div>
                      ) : (
                        <FootprintIcon
                          size={14}
                          color={isCurrent ? '#14B8A6' : '#5F6368'}
                          opacity={isCurrent ? 1 : 0.5}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: isCompleted || isCurrent ? '600' : '400',
                        color: isCompleted ? '#14B8A6' : isCurrent ? '#E8EAED' : '#5F6368',
                        marginBottom: '1px',
                        transition: 'color 0.3s ease',
                      }}>
                        {step.label}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: isCompleted ? '#6B7280' : '#5F6368',
                      }}>
                        {step.desc}
                      </div>
                    </div>
                    {isCompleted && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                          fontSize: '14px',
                        }}
                      >
                        {step.icon}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative',
      }}>
        {/* Subtle background particles on form side */}
        {PARTICLES.slice(0, 6).map((p) => (
          <motion.div
            key={`form-p-${p.id}`}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size * 0.7}px`,
              height: `${p.size * 0.7}px`,
              borderRadius: '50%',
              background: '#14B8A6',
              pointerEvents: 'none',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.12, 0],
            }}
            transition={{
              duration: p.duration * 1.2,
              delay: p.delay + 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(20, 184, 166, 0.06)',
            border: '1px solid rgba(20, 184, 166, 0.12)',
            marginBottom: '24px',
          }}>
            <FootprintIcon size={11} color="#14B8A6" />
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#14B8A6',
              letterSpacing: '0.02em',
            }}>
              Carbon Intelligence Platform
            </span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#E8EAED',
              marginBottom: '8px',
              letterSpacing: '-0.01em',
            }}>
              Create your account
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#6B7280',
            }}>
              Start tracking your carbon footprint today
            </p>
          </div>

          {/* Progress bar */}
          <div style={{
            marginBottom: '32px',
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
                Journey progress
              </span>
              <span style={{ fontSize: '12px', color: '#14B8A6', fontWeight: '600' }}>
                {completedCount}/4 steps
              </span>
            </div>
            <div style={{
              height: '3px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.04)',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, #0D9488 0%, #14B8A6 50%, #2DD4BF 100%)',
                }}
              />
            </div>
          </div>

          {/* Email confirmation required */}
          <AnimatePresence>
            {emailConfirmRequired && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  padding: '18px 20px',
                  borderRadius: '12px',
                  background: 'rgba(20, 184, 166, 0.06)',
                  border: '1px solid rgba(20, 184, 166, 0.15)',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <FiMail size={14} color="#14B8A6" />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#14B8A6' }}>
                    Check your email
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#9AA0A6', lineHeight: '1.5', margin: 0 }}>
                  We sent a confirmation link to <strong style={{ color: '#E8EAED' }}>{email}</strong>.
                  Click the link to activate your account.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#EF4444',
                  fontSize: '14px',
                  marginBottom: '24px',
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {fields.map((field, i) => {
              const Icon = field.icon;
              const isFilled = field.value.length > 0;
              const isFocused = false;

              return (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  style={{ marginBottom: '18px' }}
                >
                  <label style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#9AA0A6',
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    {field.key === 'confirm' ? 'Confirm Password' : field.key.charAt(0).toUpperCase() + field.key.slice(1)}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Icon
                      size={16}
                      color={isFilled ? '#14B8A6' : '#5F6368'}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        transition: 'color 0.3s',
                      }}
                    />
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      minLength={field.minLength}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 42px 14px 42px',
                        borderRadius: '10px',
                        border: `1px solid ${isFilled ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255,255,255,0.06)'}`,
                        background: isFilled ? 'rgba(20, 184, 166, 0.03)' : '#161616',
                        fontSize: '15px',
                        color: '#E8EAED',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(20, 184, 166, 0.4)';
                        e.target.style.background = 'rgba(20, 184, 166, 0.04)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isFilled ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255,255,255,0.06)';
                        e.target.style.background = isFilled ? 'rgba(20, 184, 166, 0.03)' : '#161616';
                      }}
                    />
                    {/* Completion check */}
                    <AnimatePresence>
                      {isFilled && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          style={{
                            position: 'absolute',
                            right: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'rgba(20, 184, 166, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FiCheck size={11} color="#14B8A6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Password strength hint */}
                  {field.key === 'password' && password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        marginTop: '8px',
                        display: 'flex',
                        gap: '4px',
                      }}
                    >
                      {[1, 2, 3, 4].map((level) => {
                        const strength = password.length >= 8 ? 4 : password.length >= 6 ? 3 : password.length >= 4 ? 2 : 1;
                        const isActive = level <= strength;
                        const colors = ['#EF4444', '#F97316', '#F59E0B', '#14B8A6'];
                        return (
                          <div
                            key={level}
                            style={{
                              flex: 1,
                              height: '2px',
                              borderRadius: '1px',
                              background: isActive ? colors[strength - 1] : 'rgba(255,255,255,0.06)',
                              transition: 'background 0.3s',
                            }}
                          />
                        );
                      })}
                      <span style={{
                        fontSize: '11px',
                        color: '#6B7280',
                        marginLeft: '8px',
                      }}>
                        {password.length >= 8 ? 'Strong' : password.length >= 6 ? 'Good' : password.length >= 4 ? 'Fair' : 'Weak'}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '10px',
                border: 'none',
                background: loading ? '#1A1A1A' : 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(20, 184, 166, 0.25)',
                marginTop: '8px',
              }}
            >
              {loading ? (
                'Creating your account...'
              ) : (
                <>
                  Begin Your Journey
                  <FiArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: '28px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
            }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#14B8A6',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div style={{
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
          }}>
            {[
              { icon: FiShield, label: 'SOC 2 Compliant' },
              { icon: FiCheck, label: 'GDPR Ready' },
              { icon: FiCheck, label: 'Open Source' },
            ].map((badge) => (
              <div
                key={badge.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <badge.icon size={10} color="#5F6368" />
                <span
                  style={{
                    fontSize: '11px',
                    color: '#5F6368',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
