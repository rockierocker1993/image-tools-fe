import { WebSocketJobEvent } from '@/types/job.types';
import { create } from 'zustand';

export type WebSocketConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WebSocketState {
  connectionState: WebSocketConnectionState;
  jobResults: Record<string, WebSocketJobEvent>;
}

interface WebSocketActions {
  setConnectionState: (state: WebSocketConnectionState) => void;
  updateJobStatus: (requestId: string, status: boolean, webpUrl?: string, module?: string) => void;
  removeJob: (requestId: string) => void;
  reset: () => void;
}

type WebSocketStore = WebSocketState & WebSocketActions;

const initialState: WebSocketState = {
  connectionState: 'disconnected',
  jobResults: {}
};

export const useWebSocketStore = create<WebSocketStore>()((set) => ({
  ...initialState,

  setConnectionState: (connectionState) => set({ connectionState }),

  updateJobStatus: (requestId, status, webpUrl, module) =>
    set((state) => ({
      jobResults: {
        ...state.jobResults,
        [requestId]: { requestId, status, webpUrl, module },
      }
    })),

  removeJob: (requestId) =>
    set((state) => {
      const { [requestId]: _rjob, ...jobResults } = state.jobResults;
      return { jobResults };
    }),

  reset: () => set(initialState),
}));
