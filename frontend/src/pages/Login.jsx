import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';
import Logo from '../components/Logo';
import { FootprintIcon } from '../components/FootprintTrail';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const footprintPositions = [
    { x: 120, y: 60, rotation: -15, size: 28 },
    { x: 180, y: 110, rotation: 15, size: 26 },
    { x: 130, y: 170, rotation: -12, size: 24 },
    { x: 190, y: 230, rotation: 12, size: 22 },
    { x: 140, y: 290, rotation: -10, size: 20 },
    { x: 185, y: 350, rotation: 10, size: 18 },
    { x: 145, y: 410, rotation: -8, size: 16 },
    { x: 175, y: 470, rotation: 8, size: 15 },
    { x: 150, y: 530, rotation: -6, size: 14 },
    { x: 170, y: 580, rotation: 6, size: 13 },
    { x: 155, y: 630, rotation: -5, size: 12 },
    { x: 165, y: 680, rotation: 5, size: 11 },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0A0A0A',
    }}>
      {/* Left panel - Branding with footprint trail */}
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
        {/* Background gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(20, 184, 166, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Clearly visible footprint trail */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}>
          {footprintPositions.map((fp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.15 - i * 0.008, scale: 1 }}
              transition={{
                delay: 0.3 + i * 0.1,
                duration: 0.5,
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
          ))}
        </div>

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
              Every step toward
              <br />
              <span style={{ color: '#14B8A6' }}>sustainability</span>
              <br />
              starts here.
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              lineHeight: '1.7',
              maxWidth: '360px',
              marginBottom: '48px',
            }}>
              Track your carbon footprint. Make meaningful changes.
              Join a community building a greener future.
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '40px',
            }}>
              {[
                { value: '4.2M', label: 'kg CO₂ tracked' },
                { value: '12K', label: 'active users' },
                { value: '89%', label: 'reduced footprint' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#E8EAED',
                    marginBottom: '4px',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(20, 184, 166, 0.08)',
              border: '1px solid rgba(20, 184, 166, 0.15)',
              marginBottom: '20px',
            }}>
              <FootprintIcon size={12} color="#14B8A6" />
              <span style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#14B8A6',
              }}>
                Carbon Intelligence Platform
              </span>
            </div>

            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#E8EAED',
              marginBottom: '8px',
            }}>
              Welcome back
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#6B7280',
            }}>
              Continue your sustainability journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#9AA0A6',
                display: 'block',
                marginBottom: '8px',
              }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail
                  size={16}
                  color="#5F6368"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: '#161616',
                    fontSize: '15px',
                    color: '#E8EAED',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(20, 184, 166, 0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#9AA0A6',
                display: 'block',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock
                  size={16}
                  color="#5F6368"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: '#161616',
                    fontSize: '15px',
                    color: '#E8EAED',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(20, 184, 166, 0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
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
                boxShadow: loading ? 'none' : '0 4px 14px rgba(20, 184, 166, 0.3)',
              }}
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: '32px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
            }}>
              New to CarbonIQ?{' '}
              <Link
                to="/register"
                style={{
                  color: '#14B8A6',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
          }}>
            {['SOC 2 Compliant', 'GDPR Ready', 'Open Source'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: '11px',
                  color: '#5F6368',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
