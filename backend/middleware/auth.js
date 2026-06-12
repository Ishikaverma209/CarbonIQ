const jwt = require('jsonwebtoken');
const inMemoryDB = require('../config/memorydb');

const protect = async (req, res, next) => {
  // Strategy 1: JWT token (backend-native auth)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret_key');
      const user = inMemoryDB.findUserById(decoded.id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        return next();
      }
    } catch (error) {
      // Token invalid or expired, try other methods
    }
  }

  // Strategy 2: Supabase user ID header (bridge auth)
  const supabaseUserId = req.headers['x-user-id'];
  if (supabaseUserId) {
    // Find or auto-create a backend user for this Supabase ID
    let user = inMemoryDB.findUserById(supabaseUserId);
    if (!user) {
      user = await inMemoryDB.createUser({
        name: req.headers['x-user-name'] || 'User',
        email: req.headers['x-user-email'] || `${supabaseUserId}@supabase.local`,
        password: 'supabase-managed',
        supabaseId: supabaseUserId,
      });
      // Override the auto-generated _id with the Supabase ID
      inMemoryDB.updateUser(user._id, { _id: supabaseUserId });
      user = inMemoryDB.findUserById(supabaseUserId);
    }
    if (user) {
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
      return next();
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
