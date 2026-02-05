const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Please ensure MongoDB is running or use MongoDB Atlas');
    // Don't exit, allow server to run without DB for now
  }
};

connectDB();

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'WhatsApp Notification Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/whatsapp', require('./routes/whatsapp.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
