import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ActiveChallenges = ({ challenges = [] }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const enrolled = challenges.filter((c) => c.enrolled && !c.completed);
  const demoChallenges = enrolled.length > 0 ? enrolled : [
    { id: 'meatless-week', title: 'Meatless Week', description: 'Go vegetarian for 7 days', progress: 60, carbonReduction: 50, duration: 7, daysLeft: 3 },
    { id: 'bike-to-work', title: 'Bike to Work', description: 'Cycle instead of driving for 5 days', progress: 30, carbonReduction: 30, duration: 5, daysLeft: 2 },
    { id: 'zero-waste', title: 'Zero Waste Day', description: 'Produce no landfill waste for 24h', progress: 85, carbonReduction: 15, duration: 1, daysLeft: 0 },
  ];

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'var(--accent)';
    if (progress >= 50) return 'var(--info)';
    return 'var(--text-muted)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '20px' 
      }}>
        <div>
          <h3 style={{ 
            fontSize: '15px', 
            fontWeight: '500', 
            color: 'var(--text-primary)',
            marginBottom: '2px',
          }}>
            Active Challenges
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {demoChallenges.length} in progress
          </p>
        </div>
        <Link
          to="/challenges"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          View all <FiArrowRight size={12} />
        </Link>
      </div>

      {/* Challenges list */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        flex: 1,
      }}>
        {demoChallenges.map((challenge, index) => {
          const progressColor = getProgressColor(challenge.progress);

          return (
            <div
              key={challenge.id}
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                transition: 'all 0.15s',
                cursor: 'pointer',
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between', 
                marginBottom: '10px' 
              }}>
                <div>
                  <h4 style={{ 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: 'var(--text-primary)', 
                    marginBottom: '2px' 
                  }}>
                    {challenge.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {challenge.description}
                  </p>
                </div>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '500',
                  background: 'var(--accent-muted)',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}>
                  -{challenge.carbonReduction} kg
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '6px' }}>
                <div style={{
                  width: '100%',
                  height: '3px',
                  background: 'var(--border-default)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      width: `${challenge.progress}%`,
                      height: '100%',
                      background: progressColor,
                      borderRadius: '2px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>

              {/* Bottom row */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: progressColor 
                }}>
                  {challenge.progress}%
                </span>

                {challenge.daysLeft !== undefined && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <FiClock size={10} color="var(--text-muted)" />
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}>
                      {challenge.daysLeft === 0 ? 'Final day' : `${challenge.daysLeft}d left`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ActiveChallenges;
