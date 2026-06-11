import { motion } from 'framer-motion';

const Logo = ({ size = 40, showText = true, className = '' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className={className}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ width: size, height: size, position: 'relative' }}
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer atom orbital ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="46"
            ry="18"
            transform="rotate(-30 50 50)"
            stroke="url(#tealGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="46"
            ry="18"
            transform="rotate(30 50 50)"
            stroke="url(#tealGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="46"
            ry="18"
            transform="rotate(90 50 50)"
            stroke="url(#tealGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Central 'C' letterform */}
          <path
            d="M62 35C57 29 50 26 42 26C30 26 20 36 20 48C20 60 30 70 42 70C50 70 57 67 62 61"
            stroke="url(#tealGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* AI node - small diamond at the center */}
          <rect
            x="46"
            y="46"
            width="8"
            height="8"
            rx="1.5"
            transform="rotate(45 50 50)"
            fill="url(#tealGradient)"
          />

          {/* Data dots on orbital paths */}
          <circle cx="50" cy="12" r="3" fill="url(#tealGradient)" opacity="0.8" />
          <circle cx="85" cy="68" r="2.5" fill="url(#tealGradient)" opacity="0.6" />
          <circle cx="15" cy="68" r="2.5" fill="url(#tealGradient)" opacity="0.6" />

          {/* Subtle connection lines from center to dots */}
          <line x1="50" y1="50" x2="50" y2="15" stroke="url(#tealGradient)" strokeWidth="0.8" opacity="0.3" />
          <line x1="50" y1="50" x2="83" y2="66" stroke="url(#tealGradient)" strokeWidth="0.8" opacity="0.3" />
          <line x1="50" y1="50" x2="17" y2="66" stroke="url(#tealGradient)" strokeWidth="0.8" opacity="0.3" />

          <defs>
            <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {showText && (
        <span
          style={{
            fontSize: size * 0.5,
            fontWeight: '700',
            color: '#E2E8F0',
            letterSpacing: '-0.02em',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Carbon<span style={{ color: '#14B8A6' }}>IQ</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
