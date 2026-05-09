import { io, type Socket } from 'socket.io-client';
import { APP_CONFIG } from '@/constants/config';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(WS_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: APP_CONFIG.WS_RECONNECT_ATTEMPTS,
      reconnectionDelay: APP_CONFIG.WS_RECONNECT_DELAY_MS,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.info('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.info('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });
  }

  return socket;
};

export const connectSocket = (token?: string): Socket => {
  const s = getSocket();
  if (token) {
    s.auth = { token };
  }
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const subscribeToJob = (
  channel: string,
  callback: (data: unknown) => void
): (() => void) => {
  const s = getSocket();
  s.on(channel, callback);
  return () => {
    s.off(channel, callback);
  };
};
