import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const insights = [
  {
    icon: '🌿',
    title: 'Meatless Monday',
    text: 'Going vegetarian for just one day saves approximately 2.5 kg of CO₂.',
    category: 'Food',
    impact: 'High',
  },
  {
    icon: '🚲',
    title: 'Bike Instead of Drive',
    text: 'Cycling 5 km instead of driving saves 1.05 kg of CO₂.',
    category: 'Transport',
    impact: 'Medium',
  },
  {
    icon: '💡',
    title: 'LED Bulbs Save Energy',
    text: 'Switching to LED bulbs uses 75% less energy.',
    category: 'Energy',
    impact: 'Medium',
  },
  {
    icon: '🛍️',
    title: 'Buy Less, Choose Well',
    text: 'The fashion industry produces 10% of global carbon emissions.',
    category: 'Shopping',
    impact: 'Low',
  },
  {
    icon: '🌊',
    title: 'Shorter Showers',
    text: 'Cutting your shower by 2 minutes saves 40 liters of water.',
    category: 'Water',
    impact: 'Medium',
  },
];

const categoryColors = {
  Food: 'var(--accent)',
  Transport: 'var(--info)',
  Energy: 'var(--warning)',
  Shopping: '#8B5CF6',
  Water: '#06B6D4',
};

const DailyInsights = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const hour = new Date().getHours();
    const index = hour % insights.length;
    setCurrentInsight(index);
  }, []);

  const nextInsight = useCallback(() => {
    setDirection(1);
    setCurrentInsight((prev) => (prev + 1) % insights.length);
  }, []);

  const prevInsight = useCallback(() => {
    setDirection(-1);
    setCurrentInsight((prev) => (prev - 1 + insights.length) % insights.length);
  }, []);

  const insight = insights[currentInsight];
  const catColor = categoryColors[insight.category] || 'var(--text-muted)';

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
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
            Daily Insight
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Fresh tip for today
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={prevInsight}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-default)',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            <FiChevronLeft size={14} />
          </button>
          <button
            onClick={nextInsight}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-default)',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', minHeight: '120px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentInsight}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%' }}
          >
            {/* Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <span style={{
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '500',
                background: 'var(--accent-muted)',
                color: catColor,
              }}>
                {insight.category}
              </span>
              <span style={{
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '500',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
              }}>
                {insight.impact}
              </span>
            </div>

            {/* Main content */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <span style={{ fontSize: '28px', lineHeight: 1 }}>
                {insight.icon}
              </span>
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: 'var(--text-primary)', 
                  marginBottom: '6px' 
                }}>
                  {insight.title}
                </h4>
                <p style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.5' 
                }}>
                  {insight.text}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '6px', 
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {insights.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentInsight ? 1 : -1);
              setCurrentInsight(i);
            }}
            style={{
              width: i === currentInsight ? '16px' : '5px',
              height: '5px',
              borderRadius: '3px',
              background: i === currentInsight ? 'var(--accent)' : 'var(--border-hover)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DailyInsights;
