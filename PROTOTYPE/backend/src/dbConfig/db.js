import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Ensure resilient SRV resolution for MongoDB Atlas across Windows / ISP DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Use default resolver if setServers fails
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // Don't exit immediately in prototype mode so server can still serve health check / clear error
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to database');
});
