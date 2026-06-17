import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

let isDBconnected = false;
const user_DB = async () => {
  if (isDBconnected && mongoose.connection.readyState === 1) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4,
    });

    isDBconnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    isDBconnected = false;
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

mongoose.connection.on('disconnected', () => {
  isDBconnected = false;
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  isDBconnected = true;
  console.log('MongoDB reconnected');
});

export default user_DB;
