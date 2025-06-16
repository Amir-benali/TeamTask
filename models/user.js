const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'manager'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);