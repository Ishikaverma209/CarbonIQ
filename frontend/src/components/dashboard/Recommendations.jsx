import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const recommendations = [
  {
    icon: '🚲',
    title: 'Try Bike Commuting',
    description: 'Switching to cycling 2x/week could save 8.4 kg CO₂ monthly.',
    impact: 'High',
    impactScore: 92,
    color: 'var(--accent)',
    potential: '8.4 kg/mo',
    action: 'Start',
  },
  {
    icon: '🥗',
    title: 'Add More Plant Meals',
    description: 'Try 3 vegetarian meals per week to reduce food footprint.',
    impact: 'Medium',
    impactScore: 68,
    color: 'var(--info)',
    potential: '5.2 kg/mo',
    action: 'Learn',
  },
  {
    icon: '💡',
    title: 'Optimize Home Energy',
    description: 'Switch to LED bulbs and reduce standby power by 10%.',
    impact: 'Medium',
    impactScore: 55,
    color: 'var(--warning)',
    potential: '3.1 kg/mo',
    action: 'Tips',
  },
];

const Recommendations = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
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
            Smart Picks
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Personalized for you
          </p>
        </div>
        <Link
          to="/assistant"
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
          Ask AI <FiArrowRight size={12} />
        </Link>
      </div>

      {/* Recommendations list */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        flex: 1,
      }}>
        {recommendations.map((rec, index) => (
          <div
            key={rec.title}
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
              gap: '12px' 
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--accent-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}>
                {rec.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginBottom: '4px' 
                }}>
                  <h4 style={{ 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: 'var(--text-primary)' 
                  }}>
                    {rec.title}
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}>
                      <FiTrendingUp size={10} />
                      {rec.impactScore}
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '500',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                    }}>
                      {rec.impact}
                    </span>
                  </div>
                </div>

                <p style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-tertiary)', 
                  lineHeight: '1.5', 
                  marginBottom: '10px' 
                }}>
                  {rec.description}
                </p>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <span style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-muted)',
                  }}>
                    Potential: <span style={{ color: 'var(--accent)', fontWeight: '500' }}>{rec.potential}</span>
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    {rec.action}
                    <FiArrowRight size={10} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Recommendations;
