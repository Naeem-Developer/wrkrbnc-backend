import mongoose from 'mongoose';

let isDBconnected = false;
const user_DB = async () => {
  if (isDBconnected) return;
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000,
    });
    isDBconnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Remove process.exit(1) to avoid crashing serverless function on cold start failure
  }
};

export default user_DB;
