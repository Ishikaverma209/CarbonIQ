import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBox, FiClock, FiAward, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';

import StreakBar from '../components/dashboard/StreakBar';
import StatCard from '../components/dashboard/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import DailyInsights from '../components/dashboard/DailyInsights';
import ActiveChallenges from '../components/dashboard/ActiveChallenges';
import RecentActivity from '../components/dashboard/RecentActivity';
import Recommendations from '../components/dashboard/Recommendations';
import AIInsightsHero from '../components/dashboard/AIInsightsHero';
import { FootprintIcon } from '../components/FootprintTrail';
import carbonService from '../lib/carbonService';

const MILESTONES = [
  { id: 1, label: 'First Step', target: 0, icon: '🌱' },
  { id: 2, label: 'Getting Started', target: 5, icon: '🌿' },
  { id: 3, label: 'Eco Starter', target: 15, icon: '🌳' },
  { id: 4, label: 'Green Hero', target: 30, icon: '💪' },
  { id: 5, label: 'Carbon Warrior', target: 50, icon: '⚡' },
  { id: 6, label: 'Planet Saver', target: 100, icon: '🌍' },
];

const BADGES = [
  { id: 'first-log', label: 'First Log', icon: '📝', unlocked: true },
  { id: 'week-streak', label: '7-Day Streak', icon: '🔥', unlocked: true },
  { id: 'transport-hero', label: 'Transport Hero', icon: '🚲', unlocked: true },
  { id: 'meatless-monday', label: 'Meatless Monday', icon: '🥗', unlocked: false },
  { id: 'energy-saver', label: 'Energy Saver', icon: '💡', unlocked: false },
  { id: 'recycler', label: 'Recycler', icon: '♻️', unlocked: false },
];

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      const [monthStats, weekStats, activitiesData, saved] = await Promise.all([
        carbonService.getStats(user.id, 'month').catch(() => ({
          totalEmissions: 0,
          categoryStats: {},
          dailyStats: {},
        })),
        carbonService.getStats(user.id, 'week').catch(() => ({
          totalEmissions: 0,
          dailyStats: {},
        })),
        carbonService.getActivities(user.id, { limit: 5 }).catch(() => []),
        carbonService.getTotalSaved(user.id).catch(() => 0),
      ]);

      setStats(monthStats);
      setActivities(activitiesData);
      setTotalSaved(saved);

      const weekDailyStats = weekStats.dailyStats || {};
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const chartData = Object.values(weekDailyStats).map((d) => ({
        day: days[new Date(d.date).getDay()],
        carbon: d.totalCarbon || 0,
        saved: 0,
      }));
      setWeeklyStats(chartData);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, location.pathname]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
      }}>
        <div style={{ 
          color: 'var(--text-tertiary)', 
          fontSize: '14px',
        }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  const weekCarbon = activities.reduce((sum, a) => sum + (a.carbon_emission || 0), 0);
  const completedChallenges = challenges.filter((c) => c.completed).length;
  const activeChallenges = challenges.filter((c) => c.enrolled && !c.completed).length;

  const carbonScore = Math.min(100, Math.round(50 + totalSaved * 0.5));
  const currentMilestone = MILESTONES.reduce((prev, curr) => 
    totalSaved >= curr.target ? curr : prev, MILESTONES[0]);
  const nextMilestone = MILESTONES.find(m => m.target > totalSaved) || MILESTONES[MILESTONES.length - 1];
  const journeyProgress = nextMilestone.target > 0 
    ? ((totalSaved / nextMilestone.target) * 100).toFixed(0) 
    : 100;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{
      maxWidth: '1120px',
      margin: '0 auto',
      padding: '40px 32px',
      paddingTop: '100px',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '40px' }}
      >
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          color: 'var(--text-primary)', 
          marginBottom: '4px',
          letterSpacing: '-0.01em',
        }}>
          {greeting}, {user?.name?.split(' ')[0]}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>{dateStr}</p>
      </motion.div>

      {/* Sustainability Journey Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background footprints */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          opacity: 0.15,
          pointerEvents: 'none',
        }}>
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 - i * 0.015 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              style={{
                position: 'absolute',
                right: `${10 + i * 28}px`,
                top: `${20 + i * 22}px`,
                transform: `rotate(${-25 + i * 6}deg)`,
              }}
            >
              <FootprintIcon size={16 + i * 1.5} color="#14B8A6" />
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 200px', gap: '32px', alignItems: 'center' }}>
          {/* Carbon Score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `conic-gradient(#14B8A6 0deg, #14B8A6 ${carbonScore * 3.6}deg, var(--bg-tertiary) ${carbonScore * 3.6}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              position: 'relative',
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    lineHeight: 1,
                  }}
                >
                  {carbonScore}
                </motion.div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Carbon Score
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}>
              {carbonScore >= 70 ? 'Excellent progress!' : carbonScore >= 50 ? 'Good progress' : 'Keep improving'}
            </div>
          </div>

          {/* Journey Trail */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{currentMilestone.icon}</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                }}>
                  {currentMilestone.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}>
                  Next:
                </span>
                <span style={{ fontSize: '14px' }}>{nextMilestone.icon}</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                }}>
                  {nextMilestone.label}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{
              height: '8px',
              borderRadius: '4px',
              background: 'var(--bg-tertiary)',
              marginBottom: '12px',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: journeyProgress + '%' }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #14B8A6 0%, #2DD4BF 100%)',
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}>
                {totalSaved.toFixed(1)} kg CO₂ saved
              </span>
              <span style={{
                fontSize: '12px',
                color: 'var(--accent)',
                fontWeight: '500',
              }}>
                {(nextMilestone.target - totalSaved).toFixed(1)} kg to {nextMilestone.label}
              </span>
            </div>

            {/* Milestone dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '16px',
              padding: '0 8px',
            }}>
              {MILESTONES.map((milestone) => (
                <div
                  key={milestone.id}
                  style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + milestone.id * 0.05, type: 'spring' }}
                    style={{
                      opacity: totalSaved >= milestone.target ? 1 : 0.3,
                      transform: `scale(${totalSaved >= milestone.target ? 1 : 0.7})`,
                      filter: totalSaved >= milestone.target ? 'none' : 'grayscale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <FootprintIcon
                      size={totalSaved >= milestone.target ? 18 : 12}
                      color={totalSaved >= milestone.target ? '#14B8A6' : '#5F6368'}
                    />
                  </motion.div>
                  <span style={{
                    fontSize: '9px',
                    color: totalSaved >= milestone.target ? 'var(--text-secondary)' : 'var(--text-muted)',
                  }}>
                    {milestone.target}kg
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px',
            }}>
              Recent Badges
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
            }}>
              {BADGES.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + BADGES.indexOf(badge) * 0.05 }}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: badge.unlocked ? 'rgba(20, 184, 166, 0.1)' : 'var(--bg-tertiary)',
                    border: `1px solid ${badge.unlocked ? 'rgba(20, 184, 166, 0.2)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    opacity: badge.unlocked ? 1 : 0.4,
                    filter: badge.unlocked ? 'none' : 'grayscale(1)',
                    transition: 'all 0.3s ease',
                  }}
                  title={badge.label}
                >
                  {badge.icon}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <QuickActions />
      </div>

      {/* AI Insights Hero */}
      <AIInsightsHero userName={user?.name} totalSaved={totalSaved} />

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatCard
          icon={<FiBox size={18} />}
          label="Total Saved"
          value={totalSaved.toFixed(1)}
          unit="kg CO₂"
          trend="up"
          trendValue="+12%"
          changePercent={12}
          progress={Math.min(totalSaved / 100, 1)}
          insight="100kg goal"
          color="#14B8A6"
          delay={0}
        />
        <StatCard
          icon={<FiClock size={18} />}
          label="This Week"
          value={weekCarbon.toFixed(1)}
          unit="kg CO₂"
          trend={weekCarbon > 20 ? 'down' : 'up'}
          trendValue={weekCarbon > 20 ? '+5%' : '-8%'}
          changePercent={weekCarbon > 20 ? 5 : -8}
          progress={weekCarbon / 30}
          insight="30kg target"
          color="#3B82F6"
          delay={0.05}
        />
        <StatCard
          icon={<FiAward size={18} />}
          label="Challenges"
          value={`${completedChallenges}/${challenges.length || 5}`}
          trend="neutral"
          trendValue={`${activeChallenges} active`}
          progress={challenges.length ? completedChallenges / challenges.length : 0}
          insight={`${activeChallenges} in progress`}
          color="#F59E0B"
          delay={0.1}
        />
        <StatCard
          icon={<FiTarget size={18} />}
          label="Impact Rank"
          value={`#${Math.max(1, 50 - Math.floor(totalSaved / 10))}`}
          trend="up"
          trendValue="Top 3%"
          changePercent={3}
          insight="Improved 2 ranks"
          color="#10B981"
          delay={0.15}
        />
      </div>

      {/* Weekly Chart */}
      <div style={{ marginBottom: '32px' }}>
        <WeeklyChart data={weeklyStats} />
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px',
      }}>
        <DailyInsights />
        <ActiveChallenges challenges={challenges} />
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '48px',
      }}>
        <RecentActivity activities={activities} onUpdate={fetchData} />
        <Recommendations />
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '24px 0',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          CarbonIQ Analytics Platform
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
