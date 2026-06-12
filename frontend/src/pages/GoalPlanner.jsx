import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiCheck, FiPlus, FiTrash2, FiTrendingUp, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FootprintIcon } from '../components/FootprintTrail';
import carbonService from '../lib/carbonService';

const PRESET_GOALS = [
  { id: 'weekly-track', title: 'Log activities 5 days/week', category: 'tracking', target: 5, unit: 'days', icon: '📊', co2: 0 },
  { id: 'meatless-week', title: 'Meatless Monday for 4 weeks', category: 'food', target: 4, unit: 'weeks', icon: '🥗', co2: 40 },
  { id: 'bike-commute', title: 'Bike to work 3 times', category: 'transport', target: 3, unit: 'trips', icon: '🚲', co2: 18 },
  { id: 'cold-wash', title: 'Cold water wash for 2 weeks', category: 'energy', target: 14, unit: 'days', icon: '🧊', co2: 14 },
  { id: 'zero-waste-day', title: 'Zero-waste day this month', category: 'waste', target: 1, unit: 'day', icon: '♻️', co2: 5 },
  { id: 'shorter-showers', title: '5-minute showers for a week', category: 'water', target: 7, unit: 'days', icon: '🚿', co2: 7 },
  { id: 'streak-7', title: '7-day logging streak', category: 'tracking', target: 7, unit: 'days', icon: '🔥', co2: 0 },
  { id: 'streak-30', title: '30-day logging streak', category: 'tracking', target: 30, unit: 'days', icon: '⚡', co2: 0 },
];

const CATEGORY_COLORS = {
  tracking: '#3B82F6',
  food: '#10B981',
  transport: '#F59E0B',
  energy: '#EF4444',
  waste: '#8B5CF6',
  water: '#06B6D4',
};

const GoalPlanner = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', category: 'tracking', target: '', unit: 'days' });
  const [stats, setStats] = useState({ totalEmissions: 0, categoryStats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const [statsData] = await Promise.all([
        carbonService.getStats(user.id, 'month').catch(() => ({ totalEmissions: 0, categoryStats: {} })),
      ]);
      setStats(statsData);
      // Load saved goals from localStorage
      const savedGoals = localStorage.getItem(`carboniq_goals_${user.id}`);
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    } catch (err) {
      console.error('Goal planner load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    if (user?.id) {
      localStorage.setItem(`carboniq_goals_${user.id}`, JSON.stringify(updatedGoals));
    }
  };

  const addGoal = () => {
    if (!newGoal.title.trim() || !newGoal.target) return;
    const goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      category: newGoal.category,
      target: parseInt(newGoal.target),
      current: 0,
      unit: newGoal.unit,
      icon: PRESET_GOALS.find(g => g.category === newGoal.category)?.icon || '🎯',
      co2: 0,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    saveGoals([...goals, goal]);
    setNewGoal({ title: '', category: 'tracking', target: '', unit: 'days' });
    setShowAdd(false);
  };

  const addPresetGoal = (preset) => {
    if (goals.find(g => g.id === preset.id)) return;
    const goal = {
      ...preset,
      current: 0,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    saveGoals([...goals, goal]);
  };

  const updateProgress = (goalId, increment = 1) => {
    saveGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const newCurrent = Math.min(g.current + increment, g.target);
      return { ...g, current: newCurrent, completed: newCurrent >= g.target };
    }));
  };

  const deleteGoal = (goalId) => {
    saveGoals(goals.filter(g => g.id !== goalId));
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const totalCO2Saved = goals.reduce((sum, g) => sum + (g.completed ? g.co2 : 0), 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>Loading goals...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px', paddingTop: '100px', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiTarget size={18} color="#14B8A6" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Goal Planner
              </h1>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginLeft: '52px' }}>
              Set targets, track progress, reduce your footprint
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '8px', border: 'none',
              background: 'var(--accent)', color: 'white',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            <FiPlus size={14} /> New Goal
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Active Goals', value: activeGoals.length, icon: <FiTarget size={16} />, color: '#14B8A6' },
            { label: 'Completed', value: completedGoals.length, icon: <FiCheck size={16} />, color: '#10B981' },
            { label: 'CO₂ Saved', value: `${totalCO2Saved} kg`, icon: <FiTrendingUp size={16} />, color: '#3B82F6' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '18px 20px', borderRadius: '10px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Add goal form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginBottom: '24px', padding: '20px', borderRadius: '12px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                overflow: 'hidden',
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Create Custom Goal
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px', gap: '10px', marginBottom: '12px' }}>
                <input
                  placeholder="Goal description..."
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  style={{
                    padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border-default)', background: 'var(--bg-tertiary)',
                    fontSize: '14px', color: 'var(--text-primary)', outline: 'none',
                  }}
                />
                <input
                  type="number"
                  placeholder="Target"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  style={{
                    padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border-default)', background: 'var(--bg-tertiary)',
                    fontSize: '14px', color: 'var(--text-primary)', outline: 'none',
                  }}
                />
                <select
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  style={{
                    padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border-default)', background: 'var(--bg-tertiary)',
                    fontSize: '14px', color: 'var(--text-primary)', outline: 'none',
                  }}
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="times">Times</option>
                  <option value="trips">Trips</option>
                  <option value="kg">kg</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  style={{
                    padding: '8px 12px', borderRadius: '6px',
                    border: '1px solid var(--border-default)', background: 'var(--bg-tertiary)',
                    fontSize: '13px', color: 'var(--text-primary)', outline: 'none',
                  }}
                >
                  <option value="tracking">Tracking</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="energy">Energy</option>
                  <option value="waste">Waste</option>
                  <option value="water">Water</option>
                </select>
                <button
                  onClick={addGoal}
                  disabled={!newGoal.title.trim() || !newGoal.target}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', border: 'none',
                    background: newGoal.title.trim() && newGoal.target ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: newGoal.title.trim() && newGoal.target ? 'white' : 'var(--text-muted)',
                    fontSize: '13px', fontWeight: '600', cursor: newGoal.title.trim() && newGoal.target ? 'pointer' : 'not-allowed',
                  }}
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  style={{
                    padding: '8px 16px', borderRadius: '6px',
                    border: '1px solid var(--border-default)', background: 'transparent',
                    fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preset goals */}
        {goals.length === 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Suggested Goals
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {PRESET_GOALS.map((preset) => {
                const added = goals.find(g => g.id === preset.id);
                return (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => addPresetGoal(preset)}
                    disabled={!!added}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', borderRadius: '10px',
                      border: `1px solid ${added ? 'rgba(20,184,166,0.2)' : 'var(--border-default)'}`,
                      background: added ? 'rgba(20,184,166,0.05)' : 'var(--bg-secondary)',
                      cursor: added ? 'default' : 'pointer', textAlign: 'left',
                      opacity: added ? 0.6 : 1,
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{preset.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {preset.title}
                      </div>
                      <div style={{ fontSize: '11px', color: CATEGORY_COLORS[preset.category] }}>
                        {preset.target} {preset.unit} · {preset.co2 > 0 ? `${preset.co2} kg CO₂` : 'Build habit'}
                      </div>
                    </div>
                    {added ? (
                      <FiCheck size={14} color="#14B8A6" />
                    ) : (
                      <FiPlus size={14} color="var(--text-muted)" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active goals */}
        {activeGoals.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Active Goals ({activeGoals.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeGoals.map((goal) => {
                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                const color = CATEGORY_COLORS[goal.category] || '#14B8A6';
                return (
                  <motion.div
                    key={goal.id}
                    layout
                    style={{
                      padding: '18px 20px', borderRadius: '10px',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{goal.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{goal.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{goal.category}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color }}>{goal.current}/{goal.target}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{goal.unit}</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          style={{ height: '100%', borderRadius: '3px', background: color }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color, minWidth: '36px', textAlign: 'right' }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button
                        onClick={() => updateProgress(goal.id)}
                        disabled={goal.completed}
                        style={{
                          padding: '6px 12px', borderRadius: '6px', border: 'none',
                          background: goal.completed ? 'var(--bg-tertiary)' : `${color}15`,
                          color: goal.completed ? 'var(--text-muted)' : color,
                          fontSize: '12px', fontWeight: '600', cursor: goal.completed ? 'default' : 'pointer',
                          border: `1px solid ${goal.completed ? 'transparent' : `${color}20`}`,
                        }}
                      >
                        +1 {goal.unit.replace(/s$/, '')}
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        style={{
                          padding: '6px 8px', borderRadius: '6px', border: 'none',
                          background: 'transparent', color: 'var(--text-muted)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                        }}
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed goals */}
        {completedGoals.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Completed ({completedGoals.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', borderRadius: '10px',
                    background: 'rgba(20, 184, 166, 0.04)', border: '1px solid rgba(20, 184, 166, 0.1)',
                    opacity: 0.8,
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(20, 184, 166, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiCheck size={12} color="#14B8A6" />
                  </div>
                  <span style={{ fontSize: '20px' }}>{goal.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', textDecoration: 'line-through' }}>
                      {goal.title}
                    </div>
                  </div>
                  {goal.co2 > 0 && (
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#14B8A6' }}>
                      -{goal.co2} kg CO₂
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {goals.length === 0 && !loading && (
          <div style={{
            padding: '48px', borderRadius: '12px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
            textAlign: 'center',
          }}>
            <FootprintIcon size={32} color="#14B8A6" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Start your goal journey
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '20px', maxWidth: '360px', margin: '0 auto 20px' }}>
              Set targets, build habits, and track your sustainability progress over time.
            </p>
            <Link
              to="/calculator"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px', border: 'none',
                background: 'var(--accent)', color: 'white',
                fontSize: '13px', fontWeight: '600', textDecoration: 'none',
              }}
            >
              Log Your First Activity <FiArrowRight size={14} />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GoalPlanner;
