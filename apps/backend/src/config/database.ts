import mongoose from 'mongoose';
import { config } from './env';

export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    // Note: Do NOT set bufferCommands to false globally so that models do not throw
    // "Cannot call findOne before initial connection is complete"
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.warn('[MongoDB] Running in fallback mode without active DB connection for local testing.');
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('[MongoDB] Disconnected successfully');
    }
  } catch (err) {
    console.error('[MongoDB] Error disconnecting:', err);
  }
}
