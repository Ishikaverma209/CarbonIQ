import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import carbonService from '../../lib/carbonService';

const categoryIcons = {
  transport: '🚗',
  energy: '⚡',
  food: '🍽️',
  shopping: '🛍️',
  water: '💧',
  waste: '♻️',
};

const RecentActivity = ({ activities = [], onUpdate }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await carbonService.deleteActivity(id);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to delete activity');
    }
    setDeletingId(null);
  };

  const displayActivities = activities.length > 0 ? activities : [];

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
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
            Recent Activity
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Last {displayActivities.length} entries
          </p>
        </div>
        <Link
          to="/calculator"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'var(--accent-muted)',
            color: 'var(--accent)',
            fontSize: '12px',
            fontWeight: '500',
            textDecoration: 'none',
          }}
        >
          <FiPlus size={12} /> Add
        </Link>
      </div>

      {/* Activity list */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2px',
        flex: 1,
      }}>
        <AnimatePresence>
          {displayActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, delay: 0.03 * index }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: index < displayActivities.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                opacity: deletingId === activity.id ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  {categoryIcons[activity.category] || '📊'}
                </div>
                <div>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: 'var(--text-primary)', 
                    marginBottom: '2px' 
                  }}>
                    {activity.activity}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '12px', 
                    color: 'var(--text-muted)',
                  }}>
                    <span style={{ textTransform: 'capitalize' }}>
                      {activity.category}
                    </span>
                    <span>·</span>
                    <span>{formatTime(activity.created_at)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <FiTrendingDown size={12} color="var(--error)" />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--error)',
                  }}>
                    {activity.carbon_emission} kg
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(activity.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.5,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecentActivity;
