require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Web3 = require('web3');
const { NirvanaAI } = require('./src/core/nirvana');
const routes = require('./routes');
const { initializeSocket } = require('./socket');

// Initialize NirvanaAI
const nirvanaAI = new NirvanaAI();

// Database connections
const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/menage');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const connectToRedis = async () => {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redisClient.on('error', (err) => console.error('Redis error:', err));
  redisClient.on('connect', () => console.log('Connected to Redis'));

  await redisClient.connect();
  return redisClient;
};

// Initialize application
const initApp = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Connect to databases
  await connectToMongo();
  const redisClient = await connectToRedis();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }));

  // Session configuration
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));

  // Passport configuration
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false);
        if (!bcrypt.compareSync(password, user.password)) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  app.use('/api', routes);

  // Initialize WebSocket
  const server = app.listen(port, () => {
    console.log(`Menage server running on port ${port}`);
    console.log(`Node.js version: ${process.version}`);
    console.log(`NirvanaAI version: ${nirvanaAI.version}`);
  });

  initializeSocket(server);

  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });
};

initApp().catch(console.error);
