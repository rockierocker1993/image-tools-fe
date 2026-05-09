'use client';

import { useEffect, useCallback } from 'react';
import { useWebSocketStore } from '@/store/websocket.store';
import { socketService } from '@/services/websocket/socket.service';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';
import type { WebSocketJobEvent } from '@/types/job.types';

type FeatureType = 'remove-background' | 'upscaler';

export const useWebSocket = (jobId: string | null, feature: FeatureType) => {
  const { accessToken } = useAuthStore();
  const { activeJobs, jobResults, jobErrors, setConnectionState, updateJobStatus } =
    useWebSocketStore();

  const handleJobEvent = useCallback(
    (event: WebSocketJobEvent) => {
      updateJobStatus(event.jobId, event.status, event.resultImageUrl, event.errorMessage);
    },
    [updateJobStatus]
  );

  useEffect(() => {
    if (accessToken) {
      socketService.connect(accessToken);
    }

    const socket = getSocket();
    socket.on('connect', () => setConnectionState('connected'));
    socket.on('disconnect', () => setConnectionState('disconnected'));
    socket.on('connect_error', () => setConnectionState('error'));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [accessToken, setConnectionState]);

  useEffect(() => {
    if (!jobId) return;

    let unsubscribe: (() => void) | undefined;

    if (feature === 'remove-background') {
      unsubscribe = socketService.subscribeToRemoveBackground(jobId, handleJobEvent);
    } else {
      unsubscribe = socketService.subscribeToUpscaler(jobId, handleJobEvent);
    }

    return () => unsubscribe?.();
  }, [jobId, feature, handleJobEvent]);

  const jobStatus = jobId ? activeJobs[jobId] : undefined;
  const resultUrl = jobId ? jobResults[jobId] : undefined;
  const error = jobId ? jobErrors[jobId] : undefined;

  return { jobStatus, resultUrl, error };
};
