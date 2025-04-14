import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    required: true,
    default: '',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

export const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema); 