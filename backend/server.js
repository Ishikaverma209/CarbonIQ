const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let dbMode = 'memory';

connectDB().then(connected => {
  if (connected) {
    dbMode = 'mongo';
    console.log('Using MongoDB');
  } else {
    console.log('Using in-memory database (demo mode)');
  }
});

app.use((req, res, next) => {
  req.dbMode = dbMode;
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/carbon', require('./routes/carbon'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/gamification', require('./routes/gamification'));

app.get('/', (req, res) => {
  res.send('CarbonIQ API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});