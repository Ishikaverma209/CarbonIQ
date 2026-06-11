import { motion } from 'framer-motion';

export const FootprintIcon = ({ size = 24, color = '#14B8A6', opacity = 1, style = {} }) => (
  <svg
    width={size}
    height={size * 1.2}
    viewBox="0 0 32 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity, ...style }}
  >
    {/* Left foot - main pad */}
    <ellipse cx="11" cy="28" rx="7" ry="8" fill={color} />
    {/* Left foot - toe 1 (big toe) */}
    <ellipse cx="6" cy="16" rx="3.2" ry="3.8" fill={color} />
    {/* Left foot - toe 2 */}
    <ellipse cx="11" cy="14" rx="2.5" ry="3.2" fill={color} />
    {/* Left foot - toe 3 */}
    <ellipse cx="15.5" cy="15.5" rx="2" ry="2.8" fill={color} />
    {/* Left foot - toe 4 */}
    <ellipse cx="18.5" cy="18" rx="1.6" ry="2.2" fill={color} />
    {/* Left foot - toe 5 */}
    <ellipse cx="20" cy="21" rx="1.2" ry="1.8" fill={color} />
  </svg>
);

export const FootprintPair = ({ size = 28, color = '#14B8A6', opacity = 1, style = {} }) => (
  <svg
    width={size * 1.8}
    height={size * 1.5}
    viewBox="0 0 56 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity, ...style }}
  >
    {/* Left foot */}
    <ellipse cx="15" cy="36" rx="6" ry="7" fill={color} />
    <ellipse cx="10" cy="24" rx="2.8" ry="3.4" fill={color} />
    <ellipse cx="15" cy="22" rx="2.2" ry="2.8" fill={color} />
    <ellipse cx="19" cy="23.5" rx="1.8" ry="2.4" fill={color} />
    <ellipse cx="22" cy="26" rx="1.4" ry="2" fill={color} />
    <ellipse cx="23.5" cy="29" rx="1" ry="1.6" fill={color} />

    {/* Right foot */}
    <ellipse cx="41" cy="36" rx="6" ry="7" fill={color} />
    <ellipse cx="46" cy="24" rx="2.8" ry="3.4" fill={color} />
    <ellipse cx="41" cy="22" rx="2.2" ry="2.8" fill={color} />
    <ellipse cx="37" cy="23.5" rx="1.8" ry="2.4" fill={color} />
    <ellipse cx="34" cy="26" rx="1.4" ry="2" fill={color} />
    <ellipse cx="32.5" cy="29" rx="1" ry="1.6" fill={color} />
  </svg>
);

const FootprintTrail = ({
  count = 10,
  opacity = 0.12,
  color = '#14B8A6',
  baseSize = 22,
  style = {},
}) => {
  return (
    <div style={{
      position: 'absolute',
      pointerEvents: 'none',
      ...style,
    }}>
      {Array.from({ length: count }, (_, i) => {
        const progress = i / (count - 1);
        const isLeft = i % 2 === 0;
        const fade = opacity * (1 - progress * 0.5);
        const scale = 1 - progress * 0.15;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: fade, y: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: 'absolute',
              left: `${i * 32}px`,
              top: `${Math.sin(i * 0.7) * 8}px`,
              transform: `rotate(${isLeft ? -12 : 12}deg) scale(${scale})`,
            }}
          >
            <FootprintIcon
              size={baseSize}
              color={color}
              opacity={1}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FootprintTrail;
