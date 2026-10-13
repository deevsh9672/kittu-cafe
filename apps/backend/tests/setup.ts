import mongoose from 'mongoose';
import { config } from '../src/config/env';

export async function setupTestDB() {
  const testDbUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/kittu_cafe_test';
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testDbUri, { serverSelectionTimeoutMS: 2000 });
    }
  } catch (e) {
    console.warn('[Test DB] MongoDB not reachable, using offline test suite mode');
  }
}

export async function teardownTestDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      // Clean test collections
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
      await mongoose.disconnect();
    }
  } catch (e) {
    // ignore
  }
}
