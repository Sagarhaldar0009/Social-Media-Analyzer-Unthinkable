import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; // Avoid multiple DB connections

  try {
    await mongoose.connect(process.env.MONGODB_URI); // No options needed
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit if MongoDB connection fails
  }
};

export default connectDB;