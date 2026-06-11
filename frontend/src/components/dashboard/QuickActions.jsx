import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGrid, FiMessageCircle, FiActivity } from 'react-icons/fi';

const actions = [
  {
    to: '/calculator',
    icon: <FiActivity size={18} />,
    label: 'Log Activity',
    description: 'Track your daily carbon',
    color: 'var(--accent)',
  },
  {
    to: '/calculator',
    icon: <FiGrid size={18} />,
    label: 'Calculator',
    description: 'Estimate emissions',
    color: 'var(--info)',
  },
  {
    to: '/assistant',
    icon: <FiMessageCircle size={18} />,
    label: 'AI Tips',
    description: 'Get smart suggestions',
    color: 'var(--warning)',
  },
];

const QuickActions = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {actions.map((action, index) => (
        <motion.div
          key={action.to + action.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
        >
          <Link
            to={action.to}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--accent-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: action.color,
              flexShrink: 0,
            }}>
              {action.icon}
            </div>
            <div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                marginBottom: '2px',
              }}>
                {action.label}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-tertiary)',
              }}>
                {action.description}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;
