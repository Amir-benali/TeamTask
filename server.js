const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
app.use('/users', authorizeUser, authorizeManager, userRoutes);
app.use('/tasks', authorizeUser, taskRoutes);

app.get('/', (req, res) => {
  res.send('root endpoint');
});







function authorizeUser(req, res, next) {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden', error: error.message });
  }
}

function authorizeManager(req, res, next) {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Forbidden' , error: 'Manager access required' });
  }
  next();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});