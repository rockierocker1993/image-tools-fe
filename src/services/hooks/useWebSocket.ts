'use client';

import { useEffect, useCallback } from 'react';
import { useWebSocketStore } from '@/services/store/websocket.store';
import { socketService } from '@/services/websocket/socket.service';
import { useAuthStore } from '@/services/store/auth.store';
import { useUploadStore } from '@/services/store/upload.store';
import { getOrCreateGuestToken } from '@/lib/auth';
import type { WebSocketJobEvent } from '@/types/job.types';

export const useWebSocket = () => {
  const { accessToken } = useAuthStore();
  const { jobResults, setConnectionState, updateJobStatus } = useWebSocketStore();
  const { setItemResultByRequestId } = useUploadStore();

  const handleJobEvent = useCallback(
    (event: WebSocketJobEvent) => {
      updateJobStatus(event.requestId, event.status, event.webpUrl, event.module);
      setItemResultByRequestId(event.requestId, event.webpUrl ?? null);
    },
    [updateJobStatus, setItemResultByRequestId]
  );

  useEffect(() => {
    const token = accessToken ?? getOrCreateGuestToken();
    socketService.connect(token);

    const cleanup = socketService.onConnectionChange(
      () => setConnectionState('connected'),
      () => setConnectionState('disconnected'),
      () => setConnectionState('error')
    );

    return cleanup;
  }, [accessToken, setConnectionState]);

  useEffect(() => {
    const token = accessToken ?? getOrCreateGuestToken();
    if (!token) return;

    let unsubscribe: (() => void) | undefined;
    unsubscribe = socketService.subscribeToJob(token, handleJobEvent);
    
    return () => unsubscribe?.();
  }, [accessToken, handleJobEvent]);

  return { jobResults };

};
