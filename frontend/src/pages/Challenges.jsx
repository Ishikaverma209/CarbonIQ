import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiTarget, FiCheck, FiAward, FiTrendingUp } from 'react-icons/fi';

const LEVELS = [
  { name: 'Green Beginner', icon: '🌱', minPoints: 0, color: '#14B8A6' },
  { name: 'Eco Explorer', icon: '🌿', minPoints: 500, color: '#0D9488' },
  { name: 'Climate Hero', icon: '🌍', minPoints: 2000, color: '#0F766E' },
];

const CHALLENGES = [
  { id: 'meatless-week', title: 'Meatless Week', desc: 'Go vegetarian for 7 days', co2: 50, days: 7, icon: '🥗', category: 'food' },
  { id: 'bike-to-work', title: 'Bike to Work', desc: 'Cycle instead of driving for 5 days', co2: 30, days: 5, icon: '🚲', category: 'transport' },
  { id: 'energy-saver', title: 'Energy Saver', desc: 'Reduce electricity by 20% for a week', co2: 20, days: 7, icon: '💡', category: 'energy' },
  { id: 'public-transit', title: 'Public Transit', desc: 'Use public transport for 5 days', co2: 40, days: 5, icon: '🚌', category: 'transport' },
  { id: 'zero-waste', title: 'Zero Waste Day', desc: 'No landfill waste for one day', co2: 5, days: 1, icon: '♻️', category: 'waste' },
  { id: 'cold-wash', title: 'Cold Wash', desc: 'Wash clothes in cold water for a week', co2: 10, days: 7, icon: '🧊', category: 'energy' },
];

const Challenges = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('challenges');
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const STORAGE_KEY_ENROLLED = `carboniq_enrolled_${user?.id}`;
  const STORAGE_KEY_COMPLETED = `carboniq_completed_${user?.id}`;
  const STORAGE_KEY_GOALS = `carboniq_goals_v2_${user?.id}`;
  const STORAGE_KEY_POINTS = `carboniq_points_${user?.id}`;

  useEffect(() => {
    setEnrolledIds(JSON.parse(localStorage.getItem(STORAGE_KEY_ENROLLED) || '[]'));
    setCompletedIds(JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLETED) || '[]'));
    setGoals(JSON.parse(localStorage.getItem(STORAGE_KEY_GOALS) || '[]'));
  }, [user?.id]);

  const points = parseInt(localStorage.getItem(STORAGE_KEY_POINTS) || '0');
  const userLevel = LEVELS.findIndex(l => points >= l.minPoints);
  const currentLevel = LEVELS[Math.max(0, userLevel)];
  const nextLevel = LEVELS[Math.min(userLevel + 1, LEVELS.length - 1)];
  const progress = userLevel < LEVELS.length - 1
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const enroll = (id) => {
    const updated = [...enrolledIds, id];
    setEnrolledIds(updated);
    save(STORAGE_KEY_ENROLLED, updated);
  };

  const completeChallenge = (id) => {
    if (completedIds.includes(id)) return;
    const updated = [...completedIds, id];
    setCompletedIds(updated);
    save(STORAGE_KEY_COMPLETED, updated);
    const challenge = CHALLENGES.find(c => c.id === id);
    const newPoints = points + (challenge?.co2 || 10);
    localStorage.setItem(STORAGE_KEY_POINTS, newPoints.toString());
  };

  const addGoal = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !newGoalTarget) return;
    const goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      target: parseInt(newGoalTarget),
      current: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, goal];
    setGoals(updated);
    save(STORAGE_KEY_GOALS, updated);
    setNewGoalTitle('');
    setNewGoalTarget('');
  };

  const updateGoal = (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, current: Math.min(g.current + 1, g.target) } : g);
    setGoals(updated);
    save(STORAGE_KEY_GOALS, updated);
  };

  const deleteGoal = (id) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    save(STORAGE_KEY_GOALS, updated);
  };

  return (
    <div className="page" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px', paddingTop: '100px', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Challenges</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '28px' }}>Complete challenges, earn points, level up.</p>

        {/* Level Card */}
        <div style={{
          padding: '24px', borderRadius: '12px',
          background: 'rgba(20, 184, 166, 0.04)', border: '1px solid rgba(20, 184, 166, 0.12)',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '36px' }}>{currentLevel.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{currentLevel.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{points} points</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <FiAward size={14} color="var(--accent)" />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {completedIds.length}/{CHALLENGES.length} completed
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {enrolledIds.length} active
              </div>
            </div>
          </div>
          {userLevel < LEVELS.length - 1 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>{currentLevel.name}</span>
                <span>{nextLevel.name}</span>
              </div>
              <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.6 }}
                  style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #14B8A6, #2DD4BF)' }}
                />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                {Math.round(100 - progress)}% to {nextLevel.name}
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'challenges', label: 'Challenges', icon: '🏆' },
            { id: 'goals', label: 'Goals', icon: '🎯' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                background: tab === t.id ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
                border: `1px solid ${tab === t.id ? 'rgba(20, 184, 166, 0.3)' : 'var(--border-default)'}`,
                color: tab === t.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: '500', cursor: 'pointer',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Challenges */}
        {tab === 'challenges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {CHALLENGES.map((c) => {
              const isEnrolled = enrolledIds.includes(c.id);
              const isCompleted = completedIds.includes(c.id);
              return (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -2 }}
                  style={{
                    padding: '20px', borderRadius: '12px',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                    opacity: isCompleted ? 0.6 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      background: isCompleted ? 'rgba(20, 184, 166, 0.1)' : 'var(--bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px',
                    }}>
                      {isCompleted ? <FiCheck size={18} color="#14B8A6" /> : c.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    <span>♻️ {c.co2} kg CO₂</span>
                    <span>📅 {c.days} days</span>
                  </div>
                  {isCompleted ? (
                    <div style={{
                      padding: '8px', borderRadius: '8px', textAlign: 'center',
                      background: 'rgba(20, 184, 166, 0.06)', border: '1px solid rgba(20, 184, 166, 0.15)',
                      fontSize: '12px', fontWeight: '600', color: '#14B8A6',
                    }}>
                      Completed · +{c.co2} pts
                    </div>
                  ) : isEnrolled ? (
                    <button
                      onClick={() => completeChallenge(c.id)}
                      style={{
                        width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                        background: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      }}
                    >
                      Mark Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => enroll(c.id)}
                      style={{
                        width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                        background: 'var(--accent)', color: 'white',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      }}
                    >
                      Join Challenge
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Goals */}
        {tab === 'goals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            <div style={{
              padding: '20px', borderRadius: '12px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Your Goals</h3>
              {goals.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '13px' }}>
                  No goals yet. Create one below.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {goals.map((g) => {
                    const pct = g.target > 0 ? Math.min((g.current / g.target) * 100, 100) : 0;
                    const done = g.current >= g.target;
                    return (
                      <div key={g.id} style={{
                        padding: '14px', borderRadius: '10px',
                        background: done ? 'rgba(20, 184, 166, 0.04)' : 'var(--bg-tertiary)',
                        border: `1px solid ${done ? 'rgba(20, 184, 166, 0.15)' : 'var(--border-subtle)'}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500', marginBottom: '10px', color: 'var(--text-primary)' }}>
                          <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{g.title}</span>
                          <span style={{ color: done ? '#14B8A6' : 'var(--accent)' }}>{g.current}/{g.target}</span>
                        </div>
                        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--bg-primary)', overflow: 'hidden', marginBottom: '8px' }}>
                          <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', background: done ? '#14B8A6' : 'var(--accent)', transition: 'width 0.3s' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {!done && (
                            <button
                              onClick={() => updateGoal(g.id)}
                          style={{
                            padding: '4px 10px', borderRadius: '4px', border: 'none',
                            background: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6',
                            fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                          }}
                            >
                              +1
                            </button>
                          )}
                          <button
                            onClick={() => deleteGoal(g.id)}
                            style={{
                              padding: '4px 8px', borderRadius: '4px', border: 'none',
                              background: 'transparent', color: 'var(--text-muted)',
                              fontSize: '11px', cursor: 'pointer',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{
              padding: '20px', borderRadius: '12px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>New Goal</h3>
              <form onSubmit={addGoal}>
                <input
                  placeholder="Goal name"
                  value={newGoalTitle}
                  onChange={e => setNewGoalTitle(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border-default)', background: 'var(--bg-tertiary)',
                    fontSize: '14px', color: 'var(--text-primary)', outline: 'none', marginBottom: '10px', boxSizing: 'border-box',
                  }}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Target"
                  value={newGoalTarget}
                  onChange={e => setNewGoalTarget(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border-default)', background: 'var(--bg-tertiary)',
                    fontSize: '14px', color: 'var(--text-primary)', outline: 'none', marginBottom: '14px', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                    background: 'var(--accent)', color: 'white',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  Create Goal
                </button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Challenges;
