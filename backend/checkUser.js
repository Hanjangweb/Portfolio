import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUser = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'admin@example.com' });
  console.log('User found:', user ? user.email : 'No user found');
  process.exit(0);
};

checkUser();
