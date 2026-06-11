import { motion } from 'framer-motion';
import { FiStar, FiTrendingUp } from 'react-icons/fi';

const StreakBar = ({ streak = 7, level = 1, points = 420, pointsToNextLevel = 1000, progress = 42 }) => {
  const getStreakBadge = () => {
    if (streak >= 30) return { label: 'Legendary', color: 'var(--warning)' };
    if (streak >= 14) return { label: 'On Fire', color: 'var(--warning)' };
    if (streak >= 7) return { label: 'Strong', color: 'var(--accent)' };
    return { label: 'Growing', color: 'var(--accent)' };
  };

  const badge = getStreakBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '32px',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
        flexWrap: 'wrap',
      }}>
        {/* Streak Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'var(--accent-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            🔥
          </div>
          <div>
            <div style={{
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px',
            }}>
              Streak
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: '600', lineHeight: 1 }}>
                {streak}
              </span>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '13px', fontWeight: '400' }}>
                days
              </span>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'var(--accent-muted)',
            }}>
              <span style={{ fontSize: '11px', fontWeight: '500', color: badge.color }}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '40px',
          background: 'var(--border-default)',
        }} />

        {/* Level Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'rgba(251, 191, 36, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FiStar color="var(--warning)" size={18} />
          </div>
          <div>
            <div style={{
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px',
            }}>
              Level
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: '600', lineHeight: 1 }}>
              {level}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
            }}>
              <FiTrendingUp size={10} color="var(--accent)" />
              <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--accent)' }}>
                +{Math.floor(points / 10)} XP
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '40px',
          background: 'var(--border-default)',
        }} />

        {/* XP Progress Section */}
        <div style={{ flex: '1 1 280px', minWidth: '280px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
            }}>
              {points} / {pointsToNextLevel} XP
            </span>
            <span style={{ 
              fontSize: '12px', 
              color: 'var(--text-muted)',
            }}>
              Next: Lv.{level + 1}
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '6px',
            background: 'var(--border-default)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: '100%',
                background: 'var(--accent)',
                borderRadius: '4px',
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '6px',
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {pointsToNextLevel - points} XP to level up
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakBar;
