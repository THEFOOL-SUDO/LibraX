const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const env = require('./config/env');
const models = require('./models');

const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const borrowRoutes = require('./routes/borrow.routes');
const studentRoutes = require('./routes/student.routes');
const requestRoutes = require('./routes/request.routes');
const fineRoutes = require('./routes/fine.routes');

const app = express();
const PORT = env.PORT;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Library Management API is running',
    health: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/fines', fineRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Sync database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Load models and associations
    Object.keys(models).forEach(modelName => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });

    await sequelize.sync();
    console.log('Database synced successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

module.exports = app;

