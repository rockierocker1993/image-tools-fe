import { connectSocket, disconnectSocket, subscribeToJob } from '@/lib/socket';
import type { WebSocketJobEvent } from '@/types/job.types';

type JobEventCallback = (event: WebSocketJobEvent) => void;

export const socketService = {
  connect: (token?: string) => {
    connectSocket(token);
  },

  disconnect: () => {
    disconnectSocket();
  },

  subscribeToRemoveBackground: (jobId: string, callback: JobEventCallback): (() => void) => {
    const socket = connectSocket();

    socket.emit('subscribe', { channel: `remove-background:${jobId}` });

    const unsubProcessing = subscribeToJob(
      `remove-background:processing`,
      (data) => callback(data as WebSocketJobEvent)
    );
    const unsubCompleted = subscribeToJob(
      `remove-background:completed`,
      (data) => callback(data as WebSocketJobEvent)
    );
    const unsubFailed = subscribeToJob(
      `remove-background:failed`,
      (data) => callback(data as WebSocketJobEvent)
    );

    return () => {
      socket.emit('unsubscribe', { channel: `remove-background:${jobId}` });
      unsubProcessing();
      unsubCompleted();
      unsubFailed();
    };
  },

  subscribeToUpscaler: (jobId: string, callback: JobEventCallback): (() => void) => {
    const socket = connectSocket();

    socket.emit('subscribe', { channel: `upscaler:${jobId}` });

    const unsubProcessing = subscribeToJob(
      `upscaler:processing`,
      (data) => callback(data as WebSocketJobEvent)
    );
    const unsubCompleted = subscribeToJob(
      `upscaler:completed`,
      (data) => callback(data as WebSocketJobEvent)
    );
    const unsubFailed = subscribeToJob(
      `upscaler:failed`,
      (data) => callback(data as WebSocketJobEvent)
    );

    return () => {
      socket.emit('unsubscribe', { channel: `upscaler:${jobId}` });
      unsubProcessing();
      unsubCompleted();
      unsubFailed();
    };
  },
};
