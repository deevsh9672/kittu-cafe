import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export function initSocketIO(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join room for specific order tracking
    socket.on('join:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`[Socket.io] ${socket.id} joined order:${orderId}`);
    });

    // Join room for KDS
    socket.on('join:kitchen', () => {
      socket.join('kitchen');
      console.log(`[Socket.io] ${socket.id} joined kitchen KDS room`);
    });

    // Join room for Admin live updates
    socket.on('join:admin', () => {
      socket.join('admin');
      console.log(`[Socket.io] ${socket.id} joined admin room`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function emitOrderCreated(order: any): void {
  if (io) {
    io.to('kitchen').emit('order:created', order);
    io.to('admin').emit('order:created', order);
  }
}

export function emitOrderStatusUpdated(orderId: string, status: string, order: any): void {
  if (io) {
    io.to(`order:${orderId}`).emit('order:status_updated', { orderId, status, order });
    io.to('kitchen').emit('order:status_updated', { orderId, status, order });
    io.to('admin').emit('order:status_updated', { orderId, status, order });
  }
}
