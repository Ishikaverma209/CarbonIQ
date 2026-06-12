import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user ? [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/calculator', label: 'Calculator' },
    { to: '/goals', label: 'Goals' },
    { to: '/challenges', label: 'Challenges' },
    { to: '/assistant', label: 'AI Helper' },
  ] : [];

  return (
    <motion.nav
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(10, 10, 10, 0.85)' : 'rgba(15, 15, 15, 0.95)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(12px)',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        transition: 'background 0.3s, backdrop-filter 0.3s',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none',
        }}>
          <Logo size={36} showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
        }}>
          {user ? (
            <>
              {/* Nav links */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2px',
                marginRight: '16px',
              }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: location.pathname === link.to ? '#14B8A6' : '#A3A3A3',
                      background: location.pathname === link.to ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* User section */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                paddingLeft: '16px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#14B8A6',
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#E5E5E5', lineHeight: 1.2 }}>
                    {user.name}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    style={{ 
                      fontSize: '11px', 
                      color: '#737373', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      lineHeight: 1.2,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#A3A3A3'}
                    onMouseLeave={(e) => e.target.style.color = '#737373'}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#A3A3A3',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s',
                }}
              >
                Log in
              </Link>
              <Link 
                to="/register" 
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
                  boxShadow: '0 4px 14px rgba(20, 184, 166, 0.25)',
                  transition: 'all 0.2s',
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        {user && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '10px',
              color: '#A3A3A3',
            }}
            className="md-hidden"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        )}
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '72px',
              left: 0,
              right: 0,
              background: 'rgba(15, 15, 15, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '16px 24px',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: location.pathname === link.to ? '#14B8A6' : '#D4D4D4',
                  background: location.pathname === link.to ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
                  marginBottom: '4px',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.06)', 
              marginTop: '8px',
              paddingTop: '12px',
            }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .md-hidden { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
