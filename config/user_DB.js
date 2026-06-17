import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

mongoose.set('bufferCommands', false);

const cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

const user_DB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4,
    }).then((mongooseInstance) => {
      cached.conn = mongooseInstance;
      console.log('Connected to MongoDB successfully');
      return cached.conn;
    }).catch((err) => {
      cached.promise = null;
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }

  return cached.promise;
};

mongoose.connection.on('disconnected', () => {
  cached.conn = null;
  cached.promise = null;
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

export default user_DB;
