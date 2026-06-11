const bcrypt = require('bcryptjs');

const users = [];
const activities = [];

// Pre-seed demo users and activities
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('password123', salt);

const demoUser = {
  _id: 'demo-user-1',
  name: 'Jane Doe (Demo)',
  email: 'demo@carboniq.com',
  password: hashedPassword,
  totalCarbonSaved: 142.5,
  level: 3,
  points: 2450,
  badges: [
    { name: 'First Steps', description: 'Log your first activity', icon: '🌱', earned: true },
    { name: 'Eco Warrior', description: 'Save 100kg CO2', icon: '🛡️', earned: true },
    { name: 'Carbon Cutter', description: 'Log 10 activities', icon: '✂️', earned: true }
  ],
  goals: [
    { _id: 'goal-1', title: 'Save 200kg CO2 this month', current: 142.5, target: 200, completed: false, createdAt: new Date() },
    { _id: 'goal-2', title: 'Use public transit for 5 commutes', current: 5, target: 5, completed: true, createdAt: new Date() }
  ],
  challenges: [
    { challengeId: 'meatless-week', title: 'Meatless Week', progress: 100, completed: true, deadline: new Date() },
    { challengeId: 'bike-to-work', title: 'Bike to Work', progress: 60, completed: false, deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
  ],
  streak: 5,
  lastLoginDate: new Date(),
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
};

// Seed activities for demo user
const activitySamples = [
  { description: 'Commuted by train instead of car', category: 'transport', carbonValue: 12.5, isPositive: true, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { description: 'Had fully plant-based lunch', category: 'food', carbonValue: 4.2, isPositive: true, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { description: 'Electricity usage - home heating', category: 'energy', carbonValue: 18.0, isPositive: false, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { description: 'Recycled plastics and cardboards', category: 'waste', carbonValue: 2.1, isPositive: true, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
  { description: 'Bought eco-friendly clothing item', category: 'shopping', carbonValue: 8.0, isPositive: true, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { description: 'Commuted by bicycle', category: 'transport', carbonValue: 15.0, isPositive: true, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
  { description: 'Left lights on in living room', category: 'energy', carbonValue: 6.4, isPositive: false, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
];

activitySamples.forEach((act, idx) => {
  activities.push({
    _id: `activity-${idx}`,
    user: 'demo-user-1',
    description: act.description,
    category: act.category,
    carbonValue: act.carbonValue,
    isPositive: act.isPositive,
    date: act.date,
    createdAt: act.date
  });
});

users.push(demoUser);

// Seed other users for leaderboard
users.push({
  _id: 'user-2',
  name: 'Marcus Sterling',
  email: 'marcus@example.com',
  password: hashedPassword,
  totalCarbonSaved: 285.0,
  level: 5,
  points: 4800,
  badges: [],
  goals: [],
  challenges: [],
  streak: 15,
  lastLoginDate: new Date(),
  createdAt: new Date()
});

users.push({
  _id: 'user-3',
  name: 'Elena Rostova',
  email: 'elena@example.com',
  password: hashedPassword,
  totalCarbonSaved: 195.4,
  level: 4,
  points: 3200,
  badges: [],
  goals: [],
  challenges: [],
  streak: 8,
  lastLoginDate: new Date(),
  createdAt: new Date()
});

const inMemoryDB = {
  users,
  activities,
  findUserByEmail: (email) => users.find(u => u.email === email),
  findUserById: (id) => users.find(u => u._id === id),
  createUser: async (data) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = {
      _id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      totalCarbonSaved: 0,
      level: 1,
      points: 0,
      badges: [],
      goals: [],
      challenges: [],
      streak: 0,
      lastLoginDate: null,
      createdAt: new Date()
    };
    users.push(user);
    return user;
  },
  matchPassword: async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },
  updateUser: (id, data) => {
    const index = users.findIndex(u => u._id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      return users[index];
    }
    return null;
  },
  createActivity: (data) => {
    const activity = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date()
    };
    activities.push(activity);
    return activity;
  },
  getActivities: (userId, query = {}) => {
    return activities
      .filter(a => a.user === userId)
      .filter(a => {
        if (query.category && a.category !== query.category) return false;
        if (query.startDate && new Date(a.date) < new Date(query.startDate)) return false;
        if (query.endDate && new Date(a.date) > new Date(query.endDate)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, query.limit || 100);
  },
  deleteActivity: (id, userId) => {
    const index = activities.findIndex(a => a._id === id && a.user === userId);
    if (index !== -1) {
      activities.splice(index, 1);
      return true;
    }
    return false;
  },
  getStats: (userId, startDate) => {
    const userActivities = activities.filter(a => 
      a.user === userId && new Date(a.date) >= new Date(startDate)
    );
    
    const categoryStats = {};
    const dailyStats = {};
    
    userActivities.forEach(a => {
      if (!categoryStats[a.category]) {
        categoryStats[a.category] = { _id: a.category, totalEmissions: 0, totalSaved: 0, count: 0 };
      }
      if (a.isPositive) {
        categoryStats[a.category].totalSaved += a.carbonValue;
      } else {
        categoryStats[a.category].totalEmissions += a.carbonValue;
      }
      categoryStats[a.category].count++;
      
      const dateStr = new Date(a.date).toISOString().split('T')[0];
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = { _id: dateStr, emissions: 0, saved: 0 };
      }
      if (a.isPositive) {
        dailyStats[dateStr].saved += a.carbonValue;
      } else {
        dailyStats[dateStr].emissions += a.carbonValue;
      }
    });
    
    return {
      categoryStats: Object.values(categoryStats),
      dailyStats: Object.values(dailyStats).sort((a, b) => a._id.localeCompare(b._id))
    };
  },
  getLeaderboard: () => {
    return users
      .map(u => ({ _id: u._id, name: u.name, totalCarbonSaved: u.totalCarbonSaved, level: u.level, points: u.points }))
      .sort((a, b) => b.totalCarbonSaved - a.totalCarbonSaved)
      .slice(0, 10);
  }
};

module.exports = inMemoryDB;