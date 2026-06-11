import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const StatCard = ({
  icon,
  label,
  value,
  unit,
  trend,
  trendValue,
  changePercent,
  progress,
  insight,
  color = 'var(--accent)',
  delay = 0,
}) => {
  const trendIcons = {
    up: <FiTrendingUp size={12} />,
    down: <FiTrendingDown size={12} />,
    neutral: <FiMinus size={12} />,
  };

  const trendColors = {
    up: '#10B981',
    down: '#EF4444',
    neutral: '#6B7280',
  };

  const progressSize = 40;
  const progressStroke = 3;
  const progressRadius = (progressSize - progressStroke) / 2;
  const progressOffset = progress !== undefined ? 2 * Math.PI * progressRadius * (1 - progress) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ 
        borderColor: 'rgba(255,255,255,0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        padding: '20px',
        transition: 'all 0.2s ease',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header with icon and progress */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>

        {progress !== undefined && (
          <svg width={progressSize} height={progressSize} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={progressSize / 2}
              cy={progressSize / 2}
              r={progressRadius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={progressStroke}
            />
            <circle
              cx={progressSize / 2}
              cy={progressSize / 2}
              r={progressRadius}
              fill="none"
              stroke={color}
              strokeWidth={progressStroke}
              strokeDasharray={2 * Math.PI * progressRadius}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
        )}
      </div>

      {/* Value and unit */}
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          gap: '4px',
          marginBottom: '4px',
        }}>
          <span style={{ 
            fontSize: '32px', 
            fontWeight: '600', 
            color: 'var(--text-primary)', 
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {value}
          </span>
          {unit && (
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '400', 
              color: 'var(--text-muted)',
              marginLeft: '2px',
            }}>
              {unit}
            </span>
          )}
        </div>

        {/* Label */}
        <div style={{ 
          fontSize: '13px', 
          color: 'var(--text-secondary)', 
          fontWeight: '500',
        }}>
          {label}
        </div>
      </div>

      {/* Trend and change */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Trend indicator */}
          {trend && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 6px',
              borderRadius: '4px',
              background: `${trendColors[trend]}12`,
              color: trendColors[trend],
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {trendIcons[trend]}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
              }}>
                {trendValue}
              </span>
            </div>
          )}

          {/* Percentage change */}
          {changePercent !== undefined && (
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: trendColors[trend] || 'var(--text-muted)',
            }}>
              {changePercent > 0 ? '+' : ''}{changePercent}%
            </span>
          )}
        </div>

        {/* Micro-insight */}
        {insight && (
          <span style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}>
            {insight}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
