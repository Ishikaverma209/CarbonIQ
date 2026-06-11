import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LEVELS = [
  { name: 'Green Beginner', icon: '🌱', minPoints: 0, color: '#14B8A6' },
  { name: 'Eco Explorer', icon: '🌿', minPoints: 500, color: '#0D9488' },
  { name: 'Climate Hero', icon: '🌍', minPoints: 2000, color: '#0F766E' },
];

const CHALLENGES = [
  { id: 'meatless-week', title: 'Meatless Week', desc: 'Go vegetarian for 7 days', co2: 50, days: 7, icon: '🥗' },
  { id: 'bike-to-work', title: 'Bike to Work', desc: 'Cycle instead of driving for 5 days', co2: 30, days: 5, icon: '🚲' },
  { id: 'energy-saver', title: 'Energy Saver', desc: 'Reduce electricity by 20% for a week', co2: 20, days: 7, icon: '💡' },
  { id: 'public-transit', title: 'Public Transit', desc: 'Use public transport for 5 days', co2: 40, days: 5, icon: '🚌' },
  { id: 'zero-waste', title: 'Zero Waste Day', desc: 'No landfill waste for one day', co2: 5, days: 1, icon: '♻️' },
  { id: 'cold-wash', title: 'Cold Wash', desc: 'Wash clothes in cold water for a week', co2: 10, days: 7, icon: '冷水' },
];

const Challenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [tab, setTab] = useState('challenges');
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', target: '' });
  const [loading, setLoading] = useState(true);

  const userLevel = LEVELS.findIndex(l => (user?.points || 0) >= l.minPoints);
  const currentLevel = LEVELS[Math.max(0, userLevel)];
  const nextLevel = LEVELS[Math.min(userLevel + 1, LEVELS.length - 1)];
  const points = user?.points || 0;
  const progress = userLevel < LEVELS.length - 1
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  useEffect(() => {
    Promise.all([
      axios.get('/api/gamification/challenges').catch(() => ({ data: CHALLENGES.map(c => ({ ...c, progress: 0, completed: false, enrolled: false })) })),
      axios.get('/api/gamification/goals').catch(() => ({ data: [] })),
    ]).then(([chRes, gRes]) => {
      setChallenges(chRes.data);
      setGoals(gRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const enroll = async (id) => {
    await axios.post(`/api/gamification/challenges/${id}/enroll`).catch(() => {});
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, enrolled: true } : c));
  };

  const addGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target) return;
    const res = await axios.post('/api/gamification/goals', newGoal).catch(() => null);
    if (res) { setGoals(prev => [...prev, res.data]); setNewGoal({ title: '', target: '' }); }
  };

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '200px', color: '#737373' }}>
      Loading...
    </div>
  );

  return (
    <div className="page">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px', color: '#E5E5E5' }}>Challenges & Goals</h1>
        <p style={{ fontSize: '15px', color: '#737373', marginBottom: '24px' }}>Complete challenges, set goals, and level up.</p>

        {/* Level Card */}
        <div className="card" style={{ 
          background: 'rgba(20, 184, 166, 0.05)', 
          border: '1px solid rgba(20, 184, 166, 0.12)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '36px' }}>{currentLevel.icon}</div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#E5E5E5' }}>{currentLevel.name}</div>
              <div style={{ fontSize: '13px', color: '#737373' }}>{points} points</div>
            </div>
          </div>
          {userLevel < LEVELS.length - 1 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#737373', marginBottom: '8px' }}>
                <span>{currentLevel.name}</span>
                <span>{nextLevel.name}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <div style={{ fontSize: '12px', color: '#737373', marginTop: '6px' }}>{Math.round(100 - progress)}% to next level</div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['challenges', 'goals'].map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`btn btn-sm`}
              style={{
                background: tab === t ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
                border: tab === t ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                color: tab === t ? '#14B8A6' : '#A3A3A3',
              }}
            >
              {t === 'challenges' ? '🏆 Challenges' : '🎯 Goals'}
            </button>
          ))}
        </div>

        {/* Challenges */}
        {tab === 'challenges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {challenges.map((c) => (
              <div key={c.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '28px' }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#E5E5E5' }}>{c.title}</div>
                    <div style={{ fontSize: '12px', color: '#737373' }}>{c.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#737373', marginBottom: '12px' }}>
                  <span>♻️ {c.co2} kg CO₂</span>
                  <span>📅 {c.days} days</span>
                </div>
                {c.enrolled ? (
                  <div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${c.progress || 0}%` }} />
                    </div>
                    <div style={{ fontSize: '12px', color: '#737373', marginTop: '6px' }}>{c.progress || 0}% complete</div>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => enroll(c.id)}>Join Challenge</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Goals */}
        {tab === 'goals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#E5E5E5' }}>Your Goals</h3>
              {goals.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#525252', padding: '24px 0', fontSize: '14px' }}>No goals yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {goals.map((g) => (
                    <div key={g._id} style={{ 
                      padding: '14px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', marginBottom: '10px', color: '#E5E5E5' }}>
                        <span>{g.title}</span>
                        <span style={{ color: '#14B8A6' }}>{g.current}/{g.target}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${Math.min((g.current / g.target) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#E5E5E5' }}>New Goal</h3>
              <form onSubmit={addGoal}>
                <input className="input" placeholder="Goal name" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} required style={{ marginBottom: '12px' }} />
                <input className="input" type="number" min="1" placeholder="Target (kg CO₂)" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} required style={{ marginBottom: '16px' }} />
                <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Create Goal</button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Challenges;
