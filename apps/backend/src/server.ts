import http from 'http';
import { createApp } from './app';
import { config } from './config/env';
import { connectDB } from './config/database';
import { initSocketIO } from './utils/socket';

async function bootstrap() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  // Initialize Socket.io
  initSocketIO(server);

  server.listen(config.PORT, () => {
    console.log(`====================================================`);
    console.log(` ☕ Kittu Cafe API & Realtime Server Running!`);
    console.log(` 📍 Location: Dausa, Rajasthan, India`);
    console.log(` 🌐 Environment: ${config.NODE_ENV}`);
    console.log(` 🚀 Port: ${config.PORT}`);
    console.log(` 🔗 Health check: http://localhost:${config.PORT}${config.API_PREFIX}/health`);
    console.log(`====================================================`);
  });

  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received. Closing HTTP server gracefully.');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  });
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap().catch(err => {
    console.error('[Server] Fatal bootstrap error:', err);
    process.exit(1);
  });
}
