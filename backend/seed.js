import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not found in .env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected for seeding.");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("Admin email or password not found in .env file. Seeding skipped.");
      return;
    }

    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin user already exists.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        fullname: 'Administrator',
        email: adminEmail,
        phoneNumber: '0000000000',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully!');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

seedAdmin();